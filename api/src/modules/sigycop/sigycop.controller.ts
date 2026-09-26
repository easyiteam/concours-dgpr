import { ActionName, BasicRoles, SecureController } from '@app/decorators';
import { Body, Get, NotFoundException, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { BasicRole } from '@prisma/client';
import { sendPushEvent } from '@asaje/sse-push-event-server';
import { Pagination } from '@app/shared/types/pagination';
import { join } from 'path';
import { tmpdir } from 'os';
import { nanoid } from 'nanoid';
import { convertToSheet } from 'aoo_to_xlsx';
import { writeFile } from 'fs/promises';
import { Response } from 'express';
import { RegisterSigycopProfile, SigycopThresholds } from './sigycop.dto';
import { SigycopService } from './sigycop.service';
import { CandidatureDownloadPagination } from '../candidature/candidature.dto';

const event = 'sigycop.update';

@SecureController('sigycop')
export class SigycopController {
  constructor(private service: SigycopService) {}

  @Get(':id/info')
  @ActionName("Détail d'une candidature par numéro d'inscription (SIGYCOP)")
  async findOneByReference(@Param('id') id: string) {
    const data = await this.service.findOneByReference(id);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Post()
  @BasicRoles(BasicRole.ADMIN, BasicRole.MEDICAL_MONITOR)
  @ActionName('Enregistrement du profil SIGYCOP')
  async registerProfile(@Body() data: RegisterSigycopProfile) {
    const result = await this.service.registerProfile(data);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Patch('thresholds/:stepId')
  @BasicRoles(BasicRole.ADMIN)
  @ActionName('Configuration des seuils SIGYCOP')
  async setThresholds(@Param('stepId') stepId: string, @Body() data: SigycopThresholds) {
    const result = await this.service.setThresholds(stepId, data);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Get('exam/:id')
  @ActionName('Liste des profils SIGYCOP par examen')
  async findAllByExam(@Query() args: Pagination, @Param('id') id: string) {
    return await this.service.findAllByExam(id, args);
  }

  @Get('exam/:id/download')
  @ActionName('Téléchargement des profils SIGYCOP par examen')
  async downloadAllByExam(
    @Query() args: CandidatureDownloadPagination,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const rows = await this.service.prepareSigycopDownload(id, args);
    const path = join(tmpdir(), nanoid() + '.xlsx');
    const buffer = await convertToSheet(rows, {
      filename: `Visite medicale SIGYCOP_${args.center ?? 'tout'}`,
    });

    await writeFile(path, buffer as Buffer);

    res.download(path);
  }
}
