import { ActionName, SecureController } from '@app/decorators';
import { ExamService } from './exam.service';
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
import { CreateCenter, CreateExam, UpdateExam } from './exam.dto';
import { ApiBody } from '@nestjs/swagger';
import { Pagination } from '@app/shared/types/pagination';
import { Exam } from '@prisma/client';
import { Response } from 'express';
import { sendPushEvent } from '@asaje/sse-push-event-server';
import { CurrentAuth } from '@app/decorators/current-auth.decorator';
import { FullAuth } from '@app/shared';

@SecureController('exams', 'Examens')
export class ExamController {
  constructor(private readonly service: ExamService) {}

  @Post()
  @ActionName("Création d'un examen")
  async create(@Body() data: CreateExam) {
    const result = await this.service.create(data);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Post('centers')
  @ActionName("Création d'un centre examen")
  async createCenter(@Body() data: CreateCenter) {
    const result = await this.service.createCenter(data);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Get('centers/:id')
  @ActionName("Liste des centre d'examens")
  async getCenters(@Param('id') id: string) {
    return this.service.getCenters(id);
  }

  @Patch('centers/:id')
  @ActionName('Cloturer un examen')
  async updateCenter(@Param('id') id: string, @Body() data: UpdateExam) {
    const result = await this.service.updateCenter(id, data);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Delete('centers/:id')
  @ActionName('Archivage de plusieurs examens')
  async removeCenter(@Param('id') id: string) {
    const result = await this.service.deleteCenter(id);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Post('many')
  @ActionName('Création de plusieurs examens')
  @ApiBody({ type: [CreateExam] })
  async createMany(@Body() data: CreateExam[]) {
    const result = await this.service.createMany(data);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Get()
  @ActionName('Liste des examens')
  async findAll(@Query() args: Pagination, @CurrentAuth() auth: FullAuth) {
    if (!auth.exams || auth.exams.length === 0)
      return this.service.findAndCount({
        paginationArgs: args,
        paginationOptions: {
          search: ['label'],
        },
      });

    const ids = auth.exams.map((exam) => exam.examId);
    const exams = [];
    for (const id of ids) {
      const exam = await this.service.getById(id);
      exams.push(exam);
    }
    return { count: exams.length, values: exams };
  }

  @Get('opened')
  @ActionName('Liste des examens ouverts')
  findAllOpened() {
    return this.service.findAndCount({
      paginationArgs: { limit: -1 },
      query: { isClosed: false },
    });
  }

  @Get('all')
  @ActionName('Liste des examens ouverts')
  findAllWithOpened() {
    return this.service.findAndCount({
      paginationArgs: { limit: -1 },
    });
  }

  @Get('download')
  @ActionName('Téléchargement des examens')
  async download(@Query() args: Pagination, @Res() res: Response) {
    const buffer = await this.service.download({
      paginationArgs: args,
      paginationOptions: {
        search: ['label'],
      },
      transformer: (data: Exam) => ({
        Libellé: data.label,
        'Date de création': data.createdAt.toLocaleDateString(),
      }),
      filename: 'Liste_des_examens',
    });
    return res.download(buffer);
  }

  @Get(':id')
  @ActionName("Détail d'un exam")
  async findOne(@Param('id') id: string) {
    const data = await this.service.getById(id);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Patch(':id')
  @ActionName("Modification d'un examen")
  async update(@Param('id') id: string, @Body() data: UpdateExam) {
    const result = await this.service.update(id, data);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Patch(':id/close')
  @ActionName('Cloturer un examen')
  async close(@Param('id') id: string) {
    const result = await this.service.update(id, { isClosed: true });
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Delete('many')
  @ApiBody({ type: [() => 'string'] })
  @ActionName('Archivage de plusieurs examens')
  async removeMany(@Body('ids') ids: string[]) {
    const result = await this.service.archiveMany(ids);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Delete('force/many')
  @ApiBody({ type: [() => 'string'] })
  @ActionName('Suppression de plusieurs examens')
  async deleteMany(@Body('ids') ids: string[]) {
    const result = await this.service.deleteMany(ids);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Delete(':id')
  @ActionName("Archivage d'un examen")
  async remove(@Param('id') id: string) {
    const result = await this.service.archive(id);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Delete(':id/force')
  @ActionName("Suppression d'un examen")
  async delete(@Param('id') id: string) {
    const result = await this.service.delete(id);
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }

  @Patch(':id/close')
  @ActionName("Cloture de l'exame")
  async closeExam(@Param('id') id: string) {
    const result = await this.service.update(id, { isClosed: true });
    sendPushEvent({ event: 'exams.update', data: {} });
    return result;
  }
}
