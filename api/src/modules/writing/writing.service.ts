import { PrismaService } from '@app/prisma';
import { randomNumber } from '@app/shared/helpers/number';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import { Injectable } from '@nestjs/common';
import {
  Candidature,
  CandidatureStatus,
  Center,
  Field,
  ParticipantProfile,
  Prisma,
  Score,
  WritingProfile,
} from '@prisma/client';
import { convertToSheet } from 'aoo_to_xlsx';
import { writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import { tmpdir } from 'os';
import { join } from 'path';
import * as QrCode from 'qrcode';
import { InsertScore } from './writing.dto';
import { generatePdf } from '@app/shared/helpers/pdf';
import { Pagination } from '@app/shared/types/pagination';
import { toDate } from '@app/shared/helpers/date';
// import { generatePdf } from '@asaje/pdf-generator';

@Injectable()
export class WritingService extends PrismaGenericRepository<
  Prisma.WritingProfileDelegate<any>,
  WritingProfile,
  Prisma.WritingProfileUncheckedCreateInput,
  Prisma.WritingProfileUncheckedUpdateInput,
  Prisma.WritingProfileWhereInput,
  Prisma.WritingProfileSelect
> {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.model = this.prisma.writingProfile;
  }

  async getCenters() {
    return await this.prisma.center.findMany();
  }

  async getCenter(id: string) {
    return await this.prisma.center.findUnique({ where: { id } });
  }

  async makeRepartition(examId: string, centerId: string, n: number) {
    const candidatures = await this.find({
      paginationArgs: { limit: -1 },
      paginationOptions: {
        search: ['candidature.reference', 'center.label'],
        includes: ['candidature.profiles', 'center'],
      },
      query: { candidature: { examId }, centerId },
    });
    const $candidatures = candidatures
      .map(
        (
          c: WritingProfile & {
            candidature: Candidature & { profiles?: ParticipantProfile[] };
          },
        ) => {
          const activeProfile = c.candidature.profiles.find((p) => p.active);
          const profile = activeProfile.value as {
            firstname: string;
            lastname: string;
          };
          return {
            ...c,
            candidature: { ...c.candidature, activeProfile },
            fullname: `${profile.lastname} ${profile.lastname}`,
          };
        },
      )
      .sort((a, b) => (a < b ? -1 : 1));

    let count = 0,
      room = 1;
    for (const c of $candidatures) {
      count++;
      if (count < n) {
        await this.update(c.id, { room });
        continue;
      }

      if (count === n) {
        await this.update(c.id, { room });
        room++;
        count = 0;
      }
    }
  }

  async getCandidateByCenterByRoom(examId: string, centerId: string) {
    const rooms = await this.prisma.writingProfile.groupBy({
      by: 'room',
      where: { candidature: { examId }, centerId },
    });

    const candidatesByRoom: Record<string, any> = {};

    for (const _room of rooms) {
      const profiles = await this.find({
        paginationArgs: { limit: -1 },
        query: { room: _room.room, candidature: { examId }, centerId },
        paginationOptions: {
          search: ['candidature.reference', 'center.label'],
          includes: ['candidature.profiles', 'center'],
        },
      });
      candidatesByRoom[_room.room] = this.populateCandidatures(profiles);
    }

    return Object.values(candidatesByRoom);
  }

  async getRoomCandidatesByCenterByRoom(
    examId: string,
    centerId: string,
    room: number,
  ) {
    const profiles = await this.find({
      paginationArgs: { limit: -1 },
      query: { room, candidature: { examId }, centerId },
      paginationOptions: {
        includes: ['candidature.profiles', 'center'],
      },
    });
    const center = await this.prisma.center.findUnique({
      where: { id: centerId },
    });

    const values = this.populateCandidatures(profiles).sort((a, b) => {
      const profileA = a.candidature.activeProfile.value;
      const profileB = b.candidature.activeProfile.value;
      if (
        profileA.lastname + profileA.firstname <
        profileB.lastname + profileB.firstname
      )
        return -1;
      return 1;
    });

    const path = join(tmpdir(), nanoid() + '.xlsx');
    const buffer = await convertToSheet(
      values.map((v) => {
        return {
          "N° d'inscription": v.candidature.reference,
          Centre: v.center.label,
          'Nom et prénom(s)': `${v.candidature.activeProfile.value.lastname} ${v.candidature.activeProfile.value.firstname}`,
          Genre: v.candidature.activeProfile.value.gender,
        };
      }),
      {
        filename: `Salle_${room}_${center.label}`,
      },
    );
    await writeFile(path, buffer as Buffer);
    return path;
  }

  populateCandidatures(
    values: (WritingProfile & {
      candidature?: Candidature & { profiles?: ParticipantProfile[] };
      scores?: Score[];
    })[],
  ) {
    return values.map(
      (
        c: WritingProfile & {
          candidature: Candidature & { profiles?: ParticipantProfile[] };
          center: Center;
          scores?: Score[];
        },
      ) => {
        const activeProfile = c.candidature.profiles.find((p) => p.active)
          .value as any;
        delete c.candidature.profiles;
        return {
          ...c,
          center: { label: c.center.label },
          candidature: {
            activeProfile: {
              value: {
                firstname: activeProfile.firstname,
                lastname: activeProfile.lastname,
                gender: activeProfile.gender,
                bithday: toDate(activeProfile.bithday),
                birthPlace: activeProfile.birthPlace,
                phone: activeProfile.phone,
                address: activeProfile.address,
              },
            },
            reference: c.candidature.reference,
          },
        };
      },
    );
  }

  async generateQrcodes(examId: string, fieldId: string) {
    const profiles = await this.find({
      paginationArgs: { limit: -1 },
      query: { candidature: { examId } },
      paginationOptions: {
        includes: ['candidature.profiles', 'center', 'scores'],
      },
    });

    const $profiles = this.populateCandidatures(profiles).sort((a, b) => {
      const profileA = a.candidature.activeProfile.value;
      const profileB = b.candidature.activeProfile.value;
      if (
        profileA.lastname + profileA.firstname <
        profileB.lastname + profileB.firstname
      )
        return -1;
      return 1;
    });

    const field = await this.prisma.field.findUnique({
      where: { id: fieldId },
    });

    let start = +randomNumber(4);
    const year = new Date().getFullYear().toString().slice(2);

    for (const profile of $profiles) {
      const code = `${year}${field.code}${start++}`;
      const qrcode = await QrCode.toDataURL(code);
      console.log(qrcode, 'qrcode');

      const existingScore = await this.prisma.score.findFirst({
        where: { writingProfileId: profile.id, fieldId: fieldId },
      });
      if (existingScore) {
        await this.prisma.score.update({
          where: { id: existingScore.id },
          data: { code, qrcode },
        });
        continue;
      }
      await this.prisma.score.create({
        data: { code, qrcode, writingProfileId: profile.id, fieldId },
      });
    }
  }

  async downloadAnonymousList(
    examId: string,
    centerId: string,
    fieldId: string,
    room: number,
  ) {
    const profiles: (WritingProfile & {
      scores?: Score[];
      candidature?: Candidature;
    })[] = await this.find({
      paginationArgs: { limit: -1 },
      query: {
        candidature: { examId },
        centerId,
        room,
      },
      paginationOptions: {
        includes: ['candidature.profiles', 'center', 'scores'],
      },
    });

    const values = this.populateCandidatures(profiles).sort((a, b) => {
      const profileA = a.candidature.activeProfile.value;
      const profileB = b.candidature.activeProfile.value;
      if (
        profileA.lastname + profileA.firstname <
        profileB.lastname + profileB.firstname
      )
        return -1;
      return 1;
    });

    const center = await this.prisma.center.findUnique({
      where: { id: centerId },
    });

    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });

    const $profiles = values.map((profile) => {
      const score = profile.scores.find((score) => score.fieldId === fieldId);

      return {
        Code: score.code,
        "Numéro d'inscription": profile.candidature.reference,
      };
    });
    const path = join(tmpdir(), nanoid() + '.xlsx');
    const buffer = await convertToSheet($profiles, {
      filename: `Liste_${exam.label}_${center.label}_Salle_${room}`,
    });
    await writeFile(path, buffer as Buffer);
    return path;
  }

  async downlaodQrCode(
    examId: string,
    centerId: string,
    fieldId: string,
    room: number,
  ) {
    const profiles: (WritingProfile & {
      scores?: Score[];
      candidature?: Candidature;
    })[] = await this.find({
      paginationArgs: { limit: -1 },
      query: {
        candidature: { examId },
        centerId,
        room,
      },
      paginationOptions: {
        includes: ['candidature.profiles', 'center', 'scores'],
      },
    });

    const values = this.populateCandidatures(profiles).sort((a, b) => {
      const profileA = a.candidature.activeProfile.value;
      const profileB = b.candidature.activeProfile.value;
      if (
        profileA.lastname + profileA.firstname <
        profileB.lastname + profileB.firstname
      )
        return -1;
      return 1;
    });

    const center = await this.prisma.center.findUnique({
      where: { id: centerId },
    });

    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });

    const $profiles = values.map((profile) => {
      const score = profile.scores.find((score) => score.fieldId === fieldId);

      return `<div class="item">
      <div>
        <img src="${score.qrcode}" />
        <div>${score.code}</div>
      </div>
    </div>`;
    });

    const template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-size: 10px;
      }

      body {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }

      .item {
        height: 10vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .item div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      }

      img {
        width: 70px;
        height: 70px;
      }
    </style>
  </head>
  <body>
    ${$profiles.join('\n')}
  </body>
</html>`;

    const path = join(
      tmpdir(),
      `Liste_${exam.label}_${center.label}_Salle_${room}.pdf`,
    );
    await generatePdf({
      html: template,
      options: {
        path,
        margin: { top: 0, left: 0, right: 0, bottom: 0 },
        format: 'A4',
        printBackground: true,
      },
    });

    return path;
  }

  async getScore(code: string) {
    const score = await this.prisma.score.findFirst({ where: { code } });
    return score;
  }

  async fixScores() {
    const profiles = await this.prisma.writingProfile.findMany({
      include: { scores: { include: { field: true } } },
    });

    for (const profile of profiles) {
      const total = profile.scores.reduce(
        (acc, cur) => acc + cur.value * cur.field.coefficient,
        0,
      );
      const mean = (
        total /
        profile.scores.reduce((acc, cur) => acc + cur.field.coefficient, 0)
      ).toFixed(2);

      await this.update(profile.id, { total, mean: +mean });
    }
  }

  async insertScore(data: InsertScore) {
    const score = await this.prisma.score.findFirst({
      where: { code: data.code },
    });
    await this.prisma.score.update({
      where: { id: score.id },
      data: { value: data.value },
    });
    const profile: WritingProfile & { scores?: (Score & { field: Field })[] } =
      await this.getById(score.writingProfileId, {
        include: { scores: { include: { field: true } } },
      });

    const total = profile.scores.reduce(
      (acc, cur) => acc + cur.value * cur.field.coefficient,
      0,
    );
    const mean = (
      total /
      profile.scores.reduce((acc, cur) => acc + cur.field.coefficient, 0)
    ).toFixed(2);

    await this.update(profile.id, { total, mean: +mean });
  }

  async getResults(examId: string, args: Pagination) {
    const profiles: (WritingProfile & {
      scores?: Score[];
      candidature?: Candidature;
    })[] = await this.find({
      paginationArgs: args ?? { limit: -1 },
      query: {
        candidature: { examId },
      },
      paginationOptions: {
        includes: ['candidature.profiles', 'center', 'scores'],
        orderBy: { rank: 'asc' },
      },
    });

    const values = this.populateCandidatures(profiles);

    const count = await this.count({ candidature: { examId } });

    return { count, values };
  }

  async prepareDownload(examId: string) {
    const profiles: (WritingProfile & {
      scores?: Score[];
      candidature?: Candidature;
    })[] = await this.find({
      paginationArgs: { limit: -1 },
      query: {
        candidature: { examId },
      },
      paginationOptions: {
        includes: ['candidature.profiles', 'center', 'scores'],
        orderBy: { rank: 'asc' },
      },
    });

    const values = this.populateCandidatures(profiles);

    const fields = await this.prisma.field.findMany({ where: { examId } });

    return values.map((value) => {
      const result: Record<string, string> = {};
      result.Rang = value.rank + '' ?? '';
      const getFieldScore = (id: string) =>
        value.scores.find((score) => score.fieldId === id);
      for (const field of fields) {
        result[`Code (${field.code})`] = getFieldScore(field.id).code ?? '';
        result[`Note (${field.code})`] =
          (getFieldScore(field.id).value ?? 0) + '';
      }
      result.Total = value.total + '';
      result.Moyenne = value.mean + '';
      return result;
    });
  }

  async prepareDownloadResult(examId: string) {
    const profiles: (WritingProfile & {
      scores?: Score[];
      candidature?: Candidature;
    })[] = await this.find({
      paginationArgs: { limit: -1 },
      query: {
        candidature: { examId },
      },
      paginationOptions: {
        includes: ['candidature.profiles', 'center', 'scores'],
        orderBy: { rank: 'asc' },
      },
    });

    const values = this.populateCandidatures(profiles);

    const fields = await this.prisma.field.findMany({ where: { examId } });

    return values.map((value) => {
      const result: Record<string, string> = {};
      const profile = value.candidature.activeProfile;
      result.Rang = value.rank + '' ?? '';
      result["Numéro d'inscription"] = value.candidature.reference;
      result['Nom'] = profile.value.lastname;
      result['Prénom(s)'] = profile.value.firstname;
      result[
        'Date et lieu de naissance'
      ] = `${profile.value.bithday} à ${profile.value.birthPlace}`;
      result.Téléphone = profile.value.phone;
      result.Adresse = profile.value.address;
      const getFieldScore = (id: string) =>
        value.scores.find((score) => score.fieldId === id);
      for (const field of fields) {
        result[`Code (${field.code})`] = getFieldScore(field.id).code ?? '';
        result[`Note (${field.code})`] =
          (getFieldScore(field.id).value ?? 0) + '';
      }
      result.Total = value.total + '';
      result.Moyenne = value.mean + '';
      return result;
    });
  }

  async selectNCandidates(id: string, n: number) {
    const profiles = await this.prisma.writingProfile.findMany({
      where: { candidature: { examId: id } },
      orderBy: { mean: 'desc' },
      include: {
        center: true,
        scores: true,
        candidature: { include: { profiles: true } },
      },
    });

    const values = this.populateCandidatures(profiles).sort((a, b) => {
      const profileA = a.candidature.activeProfile.value;
      const profileB = b.candidature.activeProfile.value;
      if (a.total < b.total) {
        return 1;
      }

      if (a.total > b.total) {
        return -1;
      }

      if (
        profileA.lastname + profileA.firstname <
        profileB.lastname + profileB.firstname
      )
        return -1;
      return 1;
    });

    let i = 0;
    for (const profile of values) {
      await this.update(profile.id, {
        rank: i + 1,
        status: i < n ? CandidatureStatus.ACCEPTED : CandidatureStatus.REJECTED,
      });
      i++;
    }
  }

  async selectMeanUnderN(id: string, n: number) {
    const profiles = await this.prisma.writingProfile.findMany({
      where: { candidature: { examId: id } },
      orderBy: { mean: 'desc' },
      include: {
        center: true,
        scores: true,
        candidature: { include: { profiles: true } },
      },
    });

    const values = this.populateCandidatures(profiles).sort((a, b) => {
      const profileA = a.candidature.activeProfile.value;
      const profileB = b.candidature.activeProfile.value;
      if (a.total < b.total) {
        return 1;
      }

      if (a.total > b.total) {
        return -1;
      }

      if (
        profileA.lastname + profileA.firstname <
        profileB.lastname + profileB.firstname
      )
        return -1;
      return 1;
    });

    let i = 0;
    for (const profile of values) {
      await this.update(profile.id, {
        rank: i + 1,
        status:
          profile.mean >= n
            ? CandidatureStatus.ACCEPTED
            : CandidatureStatus.REJECTED,
      });
      i++;
    }
  }
}
