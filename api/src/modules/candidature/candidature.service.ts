import { PrismaService } from '@app/prisma';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import {
  Candidature,
  CandidatureStatus,
  Exam,
  ParticipantProfile,
  Prisma,
} from '@prisma/client';
import {
  CandidatureDownloadPagination,
  CreateCandidature,
  UpdateCandidature,
} from './candidature.dto';
import { prefixWithZeros } from '@app/shared/helpers/number';
import {
  getTwoDigitMonth,
  getTwoDigitYear,
  toDate,
} from '@app/shared/helpers/date';
import { EmailService } from '@app/email';

@Injectable()
export class CandidatureService extends PrismaGenericRepository<
  Prisma.CandidatureDelegate<any>,
  Candidature,
  Prisma.CandidatureUncheckedCreateInput,
  Prisma.CandidatureUncheckedUpdateInput,
  Prisma.CandidatureWhereInput,
  Prisma.CandidatureSelect
> {
  constructor(
    private readonly prisma: PrismaService,
    private email: EmailService,
  ) {
    super();
    this.model = this.prisma.candidature;
  }

  async generateReference(examId: string) {
    const candidatures = await this.find({
      query: { examId },
      paginationArgs: { limit: -1 },
    });

    for (const candidature of candidatures) {
      const reference = `${getTwoDigitYear()}${getTwoDigitMonth()}C${prefixWithZeros(
        candidature.count,
      )}`;
      await this.update(candidature.id, { reference });
    }
  }

  async createCandidature({ data, examId }: CreateCandidature) {
    // if (!data.paiement) {
    //   throw new BadRequestException('Paiement is required');
    // }

    const candidature: Candidature = await this.create({ examId });

    await this.prisma.participantProfile.create({
      data: { value: data, candidatureId: candidature.id },
    });

    const reference = `PR${getTwoDigitYear()}${getTwoDigitMonth()}${
      data.gender ? data.gender[0] : 'X'
    }${prefixWithZeros(candidature.count)}`;

    return await this.update(
      candidature.id,
      { reference },
      { include: { profiles: true } },
    );
  }

  async notifyCandidate(id: string, host: string) {
    try {
      const candidate = await this.getCandidate(id);
      const info = candidate.activeProfile.value as any;
      await this.email.sendEmail({
        subject: 'DGEFC | Nouvelle candidature',
        to: info.email,
        template: 'candidature-received',
        data: {
          fullname: `${info.lastname} ${info.firstname}`,
          reference: candidate.reference,
          url: `${host}/candidatures/${candidate.id}/template`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderProfileItem(candidature: any, value: any[]) {
    let template = '';
    for (const item of value) {
      template += `
        <div class="ctn">
          <div class="bold">${item.label}</div>
          <div>${this.renderElement({
            value: candidature,
            profile: item,
          })}</div>
        </div>`;
    }
    return template;
  }

  renderElement({
    value,
    profile,
  }: {
    value: Record<string, string | number>;
    profile: any;
  }) {
    if (['text', 'number', 'email', 'choice'].includes(profile.type)) {
      return value[profile.key];
    }

    if (profile.type === 'date')
      return new Date(value[profile.key]).toLocaleDateString();

    if (profile.type === 'file') return 'OK';

    if (profile.type === 'paiement') {
      const [id, reference, transaction_key, customer_id] = (
        value[profile.key] as string
      ).split('|');
      return `<div className="text-xs flex flex-col gap-4">
        <div>
          Id de la transaction :${id}
        </div>
        <div>
          Référence : ${reference}
        </div>
        <div>
          Clé de transaction : ${transaction_key}
        </div>
        <div>
          Id client : ${customer_id}
        </div>
      </div>`;
    }
  }

  async getCandidate(id: string) {
    const _candidature: Candidature & {
      profiles?: ParticipantProfile[];
      exam?: Exam;
    } = await this.getById(id, {
      include: { profiles: true, exam: true },
    });
    const activeProfile = _candidature.profiles.find((p) => p.active);
    return { ..._candidature, activeProfile };
  }

  async generateCandidatureTemplate(id: string) {
    const candidature = await this.getCandidate(id);

    let template = '';
    for (const section of candidature.exam
      .participantProfileDefinition as any) {
      template += `
    <div>
      <h2>${section.label}</h2>

      <div class="grid">
        ${this.renderProfileItem(
          candidature.activeProfile.value,
          section.value,
        )}
      </div>
    </div>
        `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
          'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      }

      div {
        font-size: 10px !important;
      }

      body {
        padding: 10px 30px;
      }
      .h-1 {
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
      }

      .text-center {
        text-align: center;
      }

      .my-10 {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      .mt-10 {
        margin-top: 10px;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        row-gap: 30px;
      }

      .bold {
        font-weight: bold;
      }

      .box {
        border: solid 1px #aaa;
        border-radius: 3px;
        margin: 10px 0;
        padding: 5px;
        text-align: center;
      }

      h3 {
        margin: 7px;
      }

      .mt-50 {
        margin-top: 50px;
      }

      .ctn > div {
        margin-bottom: 5px;
      }
    </style>
  </head>
  <body>
    <div class="h-1">
      <div class="text-center">
        <h1>Direction Générale de la Police Républicaine</h1>
        <h3>Concours de recrutement au titre de l'année 2024</h3>
      </div>
    </div>
    <hr />

    <div class="box">
      <h3>Numéro d'inscription : ${candidature.reference}</h3>
    </div>
    ${template}
  </body>
</html>
`;
  }

  async updateCandidature(
    id: string,
    { data, ...toUpdate }: UpdateCandidature,
  ) {
    console.log('toUpdate', toUpdate);
    const candidature = await this.update(id, toUpdate);

    await this.prisma.participantProfile.updateMany({
      where: { candidatureId: id },
      data: { active: false },
    });

    await this.prisma.participantProfile.create({
      data: { value: data, candidatureId: candidature.id },
    });

    return candidature;
  }

  async acceptCandidature(id: string) {
    const participantProfile = await this.prisma.participantProfile.findFirst({
      where: { candidatureId: id, active: true },
    });
    await this.prisma.participantProfile.update({
      where: { id: participantProfile.id },
      data: { rejectReason: '' },
    });
    return await this.update(id, { status: CandidatureStatus.ACCEPTED });
  }

  async rejectCandidature(id: string, reason: string) {
    const participantProfile = await this.prisma.participantProfile.findFirst({
      where: { candidatureId: id, active: true },
    });
    await this.prisma.participantProfile.update({
      where: { id: participantProfile.id },
      data: { rejectReason: reason },
    });
    return await this.update(id, { status: CandidatureStatus.REJECTED });
  }

  async prepareDownload(id: string, args: CandidatureDownloadPagination) {
    const candidatures = await this.find({
      paginationArgs: args,
      paginationOptions: {
        search: ['reference'],
        includes: ['profiles'],
      },
      query: {
        examId: id,
        ...(args.status ? { status: args.status, examId: id } : { examId: id }),
      },
    });

    let _candidatures = candidatures.map(
      (c: Candidature & { profiles?: ParticipantProfile[] }) => {
        const activeProfile: any = c.profiles.find((p) => p.active).value;
        return {
          "Numéro d'inscription": c.reference,
          Centre: activeProfile.center,
          Nom: activeProfile.lastname,
          Prénom: activeProfile.firstname,
          Genre: activeProfile.gender,
          Téléphone: activeProfile.phone,
          Email: activeProfile.email,
          Naissance: `${toDate(activeProfile.bithday)} à ${
            activeProfile.birthPlace
          }`,
        };
      },
    );

    if (args.center) {
      _candidatures = _candidatures.filter(
        (candidature) => candidature.Centre === args.center,
      );
    }

    return _candidatures;
  }

  async gotoWritingStep(id: string) {
    const center = await this.prisma.center.findFirst({
      where: { examId: id },
    });

    if (!center) {
      throw new NotAcceptableException('No center');
    }

    await this.prisma.score.deleteMany({
      where: { profile: { candidature: { examId: id } } },
    });
    await this.prisma.writingProfile.deleteMany({
      where: { candidature: { examId: id } },
    });
    const candidates: (Candidature & { profiles?: ParticipantProfile[] })[] =
      await this.find({
        paginationArgs: { limit: -1 },
        query: {
          status: CandidatureStatus.ACCEPTED,
          examId: id,
        },
        paginationOptions: { includes: ['profiles'] },
      });

    const $candidates = candidates.map((c) => {
      const activeProfile = c.profiles.find((p) => p.active);
      return { ...c, activeProfile };
    });

    for (const candidate of $candidates) {
      await this.prisma.writingProfile.create({
        data: { candidatureId: candidate.id, centerId: center.id },
      });
    }

    return;
  }
}
