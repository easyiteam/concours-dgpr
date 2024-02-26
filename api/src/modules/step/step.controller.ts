import { ActionName, SecureController } from '@app/decorators';
import { StepService } from './step.service';
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
import { CreateStep, UpdateStep } from './step.dto';
import { ApiBody } from '@nestjs/swagger';
import { Pagination } from '@app/shared/types/pagination';
import { Response } from 'express';
import { Exam, Step } from '@prisma/client';
import { sendPushEvent } from '@asaje/sse-push-event-server';

@SecureController('steps', "Phases d'examen")
export class StepController {
  constructor(private readonly service: StepService) {}

  @Post()
  @ActionName("Création d'une phase d'examen")
  async create(@Body() data: CreateStep) {
    const result = await this.service.create(data);
    sendPushEvent({ event: 'step.update', data: {} });
    return result;
  }

  @Post('many')
  @ActionName("Création de plusieurs phases d'examen")
  @ApiBody({ type: [CreateStep] })
  async createMany(@Body() data: CreateStep[]) {
    const result = await this.service.createMany(data);
    sendPushEvent({ event: 'step.update', data: {} });
    return result;
  }

  @Get()
  @ActionName("Liste des phases d'examen")
  findAll(@Query() args: Pagination) {
    return this.service.findAndCount({
      paginationArgs: args,
      paginationOptions: {
        search: ['label'],
      },
    });
  }

  @Get('exam/:id')
  @ActionName("Liste des phases d'examen par examen")
  findAllByExam(@Query() args: Pagination, @Param('id') id: string) {
    return this.service.findAndCount({
      query: { examId: id },
      paginationArgs: args,
      paginationOptions: {
        search: ['label'],
      },
    });
  }

  @Get('download')
  @ActionName("Téléchargement des phases d'examen")
  async download(@Query() args: Pagination, @Res() res: Response) {
    const buffer = await this.service.download({
      paginationArgs: args,
      paginationOptions: {
        search: ['label'],
        includes: ['exam'],
      },
      transformer: (data: Step & { exam: Exam }) => ({
        Libellé: data.label,
        Actif: data.active ? 'Oui' : 'Non',
        Order: data.order + '',
        Examen: data.exam.label,
        Statut: data.status.toString(),
        'Date de création': data.createdAt.toLocaleDateString(),
      }),
      filename: 'Liste_des_phases_d_examen',
    });
    return res.download(buffer);
  }

  @Get(':id')
  @ActionName("Détail d'une phase d'examen")
  async findOne(@Param('id') id: string) {
    const data = await this.service.getById(id);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Get('current-step/:examId')
  @ActionName("Détail d'une phase d'examen")
  async findCurrentStep(@Param('examId') examId: string) {
    const data = await this.service.get({ examId, active: true });
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  @Patch(':id')
  @ActionName("Modification d'une phase d'examen")
  async update(@Param('id') id: string, @Body() data: UpdateStep) {
    const result = await this.service.update(id, data);
    sendPushEvent({ event: 'step.update', data: {} });
    return result;
  }

  @Patch(':id/activate')
  @ActionName("Actication d'une phase d'examen")
  async activateStep(@Param('id') id: string) {
    const result = await this.service.activateStep(id);
    sendPushEvent({ event: 'step.update', data: {} });
    return result;
  }

  @Delete('many')
  @ApiBody({ type: [() => 'string'] })
  @ActionName("Archivage de plusieurs phases d'examen")
  async removeMany(@Body('ids') ids: string[]) {
    const result = await this.service.archiveMany(ids);
    sendPushEvent({ event: 'step.update', data: {} });
    return result;
  }

  @Delete('force/many')
  @ApiBody({ type: [() => 'string'] })
  @ActionName("Suppression de plusieurs phases d'examen")
  async deleteMany(@Body('ids') ids: string[]) {
    const result = await this.service.deleteMany(ids);
    sendPushEvent({ event: 'step.update', data: {} });
    return result;
  }

  @Delete(':id')
  @ActionName("Archivage d'un examen")
  async remove(@Param('id') id: string) {
    const result = await this.service.archive(id);
    sendPushEvent({ event: 'step.update', data: {} });
    return result;
  }

  @Delete(':id/force')
  @ActionName("Suppression d'un examen")
  async delete(@Param('id') id: string) {
    const result = await this.service.delete(id);
    sendPushEvent({ event: 'step.update', data: {} });
    return result;
  }
}
