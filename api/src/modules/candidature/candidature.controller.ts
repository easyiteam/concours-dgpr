import { ActionName, CurrentHost, SecureController } from '@app/decorators';
import { CandidatureService } from './candidature.service';
import {
  Body,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  CandidatureDownloadPagination,
  CandidaturePagination,
  CreateCandidature,
  RejectCandidature,
  UpdateCandidature,
  candidatureStatusLabel,
} from './candidature.dto';
import {
  Candidature,
  CandidatureStatus,
  ParticipantProfile,
} from '@prisma/client';
import { Response } from 'express';
import { sendPushEvent } from '@asaje/sse-push-event-server';
import { generatePdf } from '@asaje/pdf-generator';
import { randomUUID } from 'crypto';
import { unlink, writeFile } from 'fs/promises';
import { convertToSheet } from 'aoo_to_xlsx';
import { tmpdir } from 'os';
import { join } from 'path';
import { nanoid } from 'nanoid';

@SecureController('candidatures', 'Candidatures')
export class CandidatureController {
  constructor(private readonly service: CandidatureService) {}

  @Post()
  @ActionName("Enregistrement d'une candidature")
  async create(@Body() data: CreateCandidature, @CurrentHost() host: string) {
    console.log('data', data);
    const result = await this.service.createCandidature(data);
    sendPushEvent({ event: 'candidatures.update', data: {} });
    this.service.notifyCandidate(result.id, host);
    return result;
  }

  @Get()
  @ActionName('Liste des candidatures')
  async findAll(@Query() args: CandidaturePagination) {
    const candidatures = await this.service.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['reference'],
        includes: ['profiles'],
      },
      ...(args.status ? { query: { status: args.status } } : {}),
    });
    return {
      ...candidatures,
      values: candidatures.values.map(
        (c: Candidature & { profiles?: ParticipantProfile[] }) => {
          const activeProfile = c.profiles.find((p) => p.active);
          return { ...c, activeProfile };
        },
      ),
    };
  }

  @Get('goto-writing-step/:id')
  @ActionName('Aller à la phase écrite')
  async gotoWritingStep(@Param('id') id: string) {
    return await this.service.gotoWritingStep(id);
  }

  @Get('exam/:id')
  @ActionName('Liste des candidatures par examen')
  async findAllByExam(
    @Query() args: CandidaturePagination,
    @Param('id') id: string,
  ) {
    const candidatures = await this.service.findAndCount({
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
    return {
      ...candidatures,
      values: candidatures.values.map(
        (c: Candidature & { profiles?: ParticipantProfile[] }) => {
          const activeProfile = c.profiles.find((p) => p.active);
          return { ...c, activeProfile };
        },
      ),
    };
  }

  @Get('exam-generate-references/:id')
  @ActionName('Liste des candidatures par examen')
  async generateReferences(@Param('id') id: string) {
    return await this.service.generateReference(id);
  }

  @Get('exam/:id/reclamations')
  @ActionName('Liste des candidatures par examen')
  async findAllReclamationsByExam(
    @Query() args: CandidaturePagination,
    @Param('id') id: string,
  ) {
    const candidatures = await this.service.find({
      paginationArgs: { limit: -1 },
      paginationOptions: {
        search: ['reference'],
        includes: ['profiles'],
      },
      query: { examId: id, status: CandidatureStatus.REJECTED },
    });
    console.log(candidatures);

    const reclamations = candidatures.filter(
      (c: Candidature & { profiles?: ParticipantProfile[] }) =>
        c.profiles.length > 1,
    );

    const start = (+args.page - 1) * +args.limit;
    const end = start + +args.limit;

    return {
      count: reclamations.length,
      values: reclamations
        .slice(start, end)
        .map((c: Candidature & { profiles?: ParticipantProfile[] }) => {
          const activeProfile = c.profiles.find((p) => p.active);
          const reasons = c.profiles
            .filter((c) => c.rejectReason)
            .map((c) => c.rejectReason);
          return { ...c, activeProfile, reasons };
        }),
    };
  }

  @Get('exam/:id/tboard')
  @ActionName('Statistiques des candidatures par examen')
  async tboardByExam(@Param('id') id: string) {
    const candidatures = await this.service.findAndCount({
      query: { examId: id },
      paginationArgs: { limit: 10 },
      paginationOptions: { includes: ['profiles'] },
    });
    const allCount = await this.service.count({ examId: id });
    const newCount = await this.service.count({
      examId: id,
      status: CandidatureStatus.INDETERMINATE,
    });
    const acceptedCount = await this.service.count({
      examId: id,
      status: CandidatureStatus.ACCEPTED,
    });
    const rejectedCount = await this.service.count({
      examId: id,
      status: CandidatureStatus.REJECTED,
    });
    return {
      candidatures: candidatures.values.map(
        (c: Candidature & { profiles?: ParticipantProfile[] }) => {
          const activeProfile = c.profiles.find((p) => p.active);
          return { ...c, activeProfile };
        },
      ),
      allCount,
      newCount,
      acceptedCount,
      rejectedCount,
    };
  }

  @Get('download/:id')
  @ActionName('Téléchargement des candidatures')
  async download(
    @Query() args: CandidatureDownloadPagination,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const candidatures = await this.service.prepareDownload(id, args);
    const path = join(tmpdir(), nanoid() + '.xlsx');
    const buffer = await convertToSheet(candidatures, {
      filename: `Candidats_${candidatureStatusLabel[args.status] ?? 'tout'}_${
        args.center ?? 'tout'
      }`,
    });

    await writeFile(path, buffer as Buffer);

    res.download(path);
  }

  @Get(':id')
  @ActionName("Détail d'une candidature")
  async findOne(@Param('id') id: string) {
    const data: Candidature & { profiles?: ParticipantProfile[] } =
      await this.service.getById(id, {
        include: { profiles: true, exam: true },
      });
    if (!data) {
      throw new NotFoundException();
    }
    const activeProfile = data.profiles.find((p) => p.active);
    const reasons = data.profiles
      .filter((c) => c.rejectReason)
      .map((c) => c.rejectReason);
    return { ...data, activeProfile, reasons };
  }

  @Get(':id/info')
  @ActionName("Détail d'une candidature par numéro d'inscription")
  async findOneByReference(@Param('id') id: string) {
    const data: Candidature & { profiles?: ParticipantProfile[] } =
      await this.service.get(
        { reference: id },
        {
          include: { profiles: true, exam: true },
        },
      );
    if (!data) {
      throw new NotFoundException();
    }
    const activeProfile = data.profiles.find((p) => p.active);
    const reasons = data.profiles
      .filter((c) => c.rejectReason)
      .map((c) => c.rejectReason);
    return { ...data, activeProfile, reasons };
  }

  @Get(':id/template')
  @ActionName("Détail d'une candidature")
  async getTemplate(@Param('id') id: string, @Res() res: Response) {
    const html = await this.service.generateCandidatureTemplate(id);
    const path = randomUUID() + '.pdf';
    await generatePdf({
      html,
      options: { path },
    });
    res.download(path, () => {
      unlink(path);
    });
  }

  @Patch(':id')
  @ActionName("Modification d'une candidature")
  async update(@Param('id') id: string, @Body() data: UpdateCandidature) {
    console.log(data);
    const result = await this.service.updateCandidature(id, data);
    sendPushEvent({ event: 'candidatures.update', data: {} });
    return result;
  }

  @Patch(':id/accept')
  @ActionName("Acceptation d'une candidature")
  async acceptCandidature(@Param('id') id: string) {
    const result = await this.service.acceptCandidature(id);
    sendPushEvent({ event: 'candidatures.update', data: {} });
    return result;
  }

  @Patch(':id/reject')
  @ActionName("Rejet d'une candidature")
  async rejectCandidature(
    @Param('id') id: string,
    @Body() data: RejectCandidature,
  ) {
    const result = await this.service.rejectCandidature(id, data.reason);
    sendPushEvent({ event: 'candidatures.update', data: {} });
    return result;
  }
}
