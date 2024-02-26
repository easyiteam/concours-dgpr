import {
  Body,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { WritingService } from './writing.service';
import { ActionName, SecureController } from '@app/decorators';
import { Pagination } from '@app/shared/types/pagination';
import { CreateRepartition, GenerateCode, InsertScore } from './writing.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Response } from 'express';
import { sendPushEvent } from '@asaje/sse-push-event-server';
import { join } from 'path';
import { tmpdir } from 'os';
import { nanoid } from 'nanoid';
import { convertToSheet } from 'aoo_to_xlsx';
import { writeFile } from 'fs/promises';

const event = 'events.update';

@SecureController('writings', 'Phase écrite')
export class WritingController {
  constructor(private service: WritingService) {}

  @Get('exam/:id')
  @ActionName('Liste des candidatures par examen')
  @UseInterceptors(CacheInterceptor)
  async findAllByExam(@Query() args: Pagination, @Param('id') id: string) {
    const candidatures = await this.service.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['candidature.reference', 'center.label'],
        includes: ['candidature.profiles', 'center'],
      },
      query: { candidature: { examId: id } },
    });
    return {
      ...candidatures,
      values: this.service.populateCandidatures(candidatures.values),
    };
  }

  @Get('exam/:id/result')
  @ActionName('Liste des candidatures par examen')
  @UseInterceptors(CacheInterceptor)
  async findAllResultByExam(
    @Query() args: Pagination,
    @Param('id') id: string,
  ) {
    return await this.service.getResults(id, args);
  }

  @Get('exam/:id/result/download')
  @ActionName('Liste des candidatures par examen')
  @UseInterceptors(CacheInterceptor)
  async downloadAllResultByExam(@Param('id') id: string, @Res() res: Response) {
    const result = await this.service.prepareDownload(id);
    const path = join(tmpdir(), nanoid() + '.xlsx');
    const buffer = await convertToSheet(result, {
      filename: `Resultats`,
    });

    await writeFile(path, buffer as Buffer);

    res.download(path);
  }

  @Get('exam/:id/result-final/download')
  @ActionName('Liste des candidatures par examen')
  @UseInterceptors(CacheInterceptor)
  async downloadAllFianlResultByExam(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const result = await this.service.prepareDownloadResult(id);
    const path = join(tmpdir(), nanoid() + '.xlsx');
    const buffer = await convertToSheet(result, {
      filename: `Resultats`,
    });

    await writeFile(path, buffer as Buffer);

    res.download(path);
  }

  @Get('centers')
  @ActionName("Liste des centre d'examen")
  @UseInterceptors(CacheInterceptor)
  async centers() {
    return await this.service.getCenters();
  }

  @Get('centers/:id')
  @ActionName("Détail d'un centre d'examen")
  @UseInterceptors(CacheInterceptor)
  async center(@Param('id') id: string) {
    return await this.service.getCenter(id);
  }

  @Post('repartition')
  @ActionName('Répartition par salle')
  async makeRepartition(@Body() data: CreateRepartition) {
    return await this.service.makeRepartition(
      data.examId,
      data.centerId,
      data.n,
    );
  }

  @Get('by-center-by-room/:examId/:centerId')
  @UseInterceptors(CacheInterceptor)
  @ActionName('Liste des candidats by centre et par salle')
  async byCenterByRoom(
    @Param('examId') examId: string,
    @Param('centerId') centerId: string,
  ) {
    return this.service.getCandidateByCenterByRoom(examId, centerId);
  }

  @Get('download-by-center-by-room/:examId/:centerId/:room')
  @UseInterceptors(CacheInterceptor)
  @ActionName('Liste des candidats by centre et par salle')
  async DownloadbyCenterByRoom(
    @Param('examId') examId: string,
    @Param('centerId') centerId: string,
    @Param('room') room: string,
    @Res() res: Response,
  ) {
    const path = await this.service.getRoomCandidatesByCenterByRoom(
      examId,
      centerId,
      +room,
    );
    res.download(path);
  }

  @Get(':id/info')
  @ActionName("Détail d'une candidature par numéro d'inscription")
  async findOneByReference(@Param('id') id: string) {
    const data = await this.service.get(
      { candidature: { reference: id } },
      { include: { center: true } },
    );
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Post('generate-codes')
  @ActionName('Génération de QRcodes')
  async generateCodes(@Body() data: GenerateCode) {
    return await this.service.generateQrcodes(data.examId, data.fieldId);
  }

  @Get('download-anonymous-list/:examId/:centerId/:fieldId/:room')
  @ActionName('Téléchargement de la liste de désanonymat')
  async downloadAnonymousList(
    @Param('examId') examId: string,
    @Param('centerId') centerId: string,
    @Param('fieldId') fieldId: string,
    @Param('room') room: string,
    @Res() res: Response,
  ) {
    const path = await this.service.downloadAnonymousList(
      examId,
      centerId,
      fieldId,
      +room,
    );
    res.download(path);
  }

  @Get('download-qrcodes/:examId/:centerId/:fieldId/:room')
  @ActionName('Téléchargement de la liste de désanonymat')
  async downloadQrcodes(
    @Param('examId') examId: string,
    @Param('centerId') centerId: string,
    @Param('fieldId') fieldId: string,
    @Param('room') room: string,
    @Res() res: Response,
  ) {
    const path = await this.service.downlaodQrCode(
      examId,
      centerId,
      fieldId,
      +room,
    );
    res.download(path);
  }

  @Post('insert-score')
  @ActionName('Enregistrement de note')
  async insertScore(@Body() data: InsertScore) {
    const result = await this.service.insertScore(data);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Get('get-score/:code')
  async getScore(@Param('code') code: string) {
    return await this.service.getScore(code);
  }

  @Get('fix-scores/all')
  async fixScores() {
    return await this.service.fixScores();
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
}
