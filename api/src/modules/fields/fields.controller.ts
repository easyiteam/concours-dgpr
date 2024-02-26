import { ActionName, SecureController } from '@app/decorators';
import { FieldsService } from './fields.service';
import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateField, UpdateField } from './fields.dto';
import { sendPushEvent } from '@asaje/sse-push-event-server';

const event = 'fields.update';

@SecureController('fields', 'Matières')
export class FieldsController {
  constructor(private readonly service: FieldsService) {}

  @Post()
  @ActionName("Création d'une matière")
  async create(@Body() data: CreateField) {
    const result = await this.service.create(data);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Patch(':id')
  @ActionName("Modification d'une matière")
  async update(@Param('id') id: string, @Body() data: UpdateField) {
    const result = await this.service.update(id, data);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Delete(':id')
  @ActionName("Archivage d'une matière")
  async archive(@Param('id') id: string) {
    const result = await this.service.archive(id);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Delete(':id/force')
  @ActionName("Archivage d'une matière")
  async remove(@Param('id') id: string) {
    const result = await this.service.delete(id);
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Get('exam/:id')
  @ActionName('Liste des matières par examen')
  async findByExam(@Param('id') id: string) {
    return await this.service.findAndCount({
      query: { examId: id },
      paginationArgs: { limit: -1 },
    });
  }
}
