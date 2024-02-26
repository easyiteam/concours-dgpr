import { ActionName, BasicRoles, SecureController } from '@app/decorators';
import {
  Body,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { RegisterPerformance, RegisterPresence } from './sport.dto';
import { SportService } from './sport.service';
import { sendPushEvent } from '@asaje/sse-push-event-server';
import { Pagination } from '@app/shared/types/pagination';
import {
  BasicRole,
  Candidature,
  ParticipantProfile,
  SportProfile,
} from '@prisma/client';
import { join } from 'path';
import { tmpdir } from 'os';
import { nanoid } from 'nanoid';
import { convertToSheet } from 'aoo_to_xlsx';
import { CandidatureDownloadPagination } from '../candidature/candidature.dto';
import { writeFile } from 'fs/promises';
import { Response } from 'express';
const event = 'sports.update';

@SecureController('sports')
export class SportController {
  constructor(private service: SportService) {}

  @BasicRoles(BasicRole.ADMIN)
  @Get('reset')
  async reset() {
    return await this.service.reset();
  }

  @Get(':id/info')
  @ActionName("Détail d'une candidature par numéro d'inscription")
  async findOneByReference(@Param('id') id: string) {
    const data = await this.service.get({ candidature: { reference: id } });
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Post()
  @ActionName('Register candidate presence')
  async registerPresence(@Body() { reference }: RegisterPresence) {
    const result = await this.service.registerPresence(reference);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Get('exam/:id')
  @ActionName('Liste des candidatures par examen')
  async findAllByExam(@Query() args: Pagination, @Param('id') id: string) {
    const candidatures = await this.service.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['candidature.reference'],
        includes: ['candidature.profiles', 'performances'],
      },
      query: { candidature: { examId: id } },
    });
    return {
      ...candidatures,
      values: candidatures.values.map(
        (
          c: SportProfile & {
            candidature: Candidature & { profiles?: ParticipantProfile[] };
          },
        ) => {
          const activeProfile = c.candidature.profiles.find((p) => p.active);
          return { ...c, candidature: { ...c.candidature, activeProfile } };
        },
      ),
    };
  }

  @Get('exam/:id/download')
  @ActionName('Liste des candidatures par examen')
  async downloadAllByExam(
    @Query() args: CandidatureDownloadPagination,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const candidatures = await this.service.prepareSportDownload(id, args);
    const path = join(tmpdir(), nanoid() + '.xlsx');
    const buffer = await convertToSheet(candidatures, {
      filename: `Performance sport_${args.center ?? 'tout'}`,
    });

    await writeFile(path, buffer as Buffer);

    res.download(path);
  }

  @Get('exam-by-rank/:id/download')
  @ActionName('Liste des candidatures par examen')
  async downloadAllByRankByExam(
    @Query() args: CandidatureDownloadPagination,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const candidatures = await this.service.prepareSportDownloadResult(
      id,
      args,
    );
    const path = join(tmpdir(), nanoid() + '.xlsx');
    const buffer = await convertToSheet(candidatures, {
      filename: `Performance sport_${args.center ?? 'tout'}`,
    });

    await writeFile(path, buffer as Buffer);

    res.download(path);
  }

  @Get('exam/:id/absents')
  @ActionName('Liste des candidatures par examen')
  async findAllAbsentsByExam(
    @Query() args: Pagination,
    @Param('id') id: string,
  ) {
    return await this.service.getAbsents(id, args);
  }

  @Get('exam-by-rank/:id')
  @ActionName('Liste des candidatures par examen')
  async findAllByExamByRank(
    @Query() args: Pagination,
    @Param('id') id: string,
  ) {
    const candidatures = await this.service.findAndCount({
      paginationArgs: { ...args },
      paginationOptions: {
        search: ['candidature.reference'],
        includes: ['candidature.profiles', 'performances'],
        orderBy: { rank: 'asc' },
      },
      query: { candidature: { examId: id } },
    });
    return {
      ...candidatures,
      values: candidatures.values.map(
        (
          c: SportProfile & {
            candidature: Candidature & { profiles?: ParticipantProfile[] };
          },
        ) => {
          const activeProfile = c.candidature.profiles.find((p) => p.active);
          return { ...c, candidature: { ...c.candidature, activeProfile } };
        },
      ),
    };
  }

  @Get('sync-performances')
  async synPerfomances() {
    return await this.service.syncPerformances();
  }

  @Delete('delete-performances/:id')
  async deletePerfomances(@Param('id') id: string) {
    return await this.service.deletePerformance(id);
  }

  @Get(':id')
  @ActionName('Get sport profile info')
  async get(@Param('id') id: string) {
    return this.service.getProfile(id);
  }

  @Get('exam/:id/stats')
  @ActionName('Liste des candidatures par examen')
  async stats(@Param('id') id: string) {
    return await this.service.presenceStats(id);
  }

  @Get('select/:id/:n/:type')
  @ActionName('Liste des candidatures par examen')
  async selectCandidate(
    @Param('id') id: string,
    @Param('n') n: string,
    @Param('type') type: string,
  ) {
    if (type === 'mean-under-n') {
      return await this.service.selectMeanUnderN(id, +n);
    }
    return await this.service.selectNCandidates(id, +n);
  }

  @Get('close-step/:id')
  @ActionName('Fermeture de la phase sportive')
  async pickCandidateForNextStep(@Param('id') id: string) {
    return await this.service.closeStep(id);
  }

  @Post('performance')
  @ActionName('Register candidate performance')
  async registerPerformance(@Body() data: RegisterPerformance) {
    const result = await this.service.registerPerformance(data);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Patch('performance/:id')
  @ActionName('Update candidate performance')
  async updatePerformance(
    @Body() data: RegisterPerformance,
    @Param('id') id: string,
  ) {
    const result = await this.service.updatePerformance(id, data);
    sendPushEvent({ event, data: {} });
    return result;
  }

  // @Get('exam/:id/download')
  // async download() {}
}
