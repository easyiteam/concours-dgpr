import { ActionName, SecureController } from '@app/decorators';
import { DocsService } from './docs.service';
import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateDoc, UpdateDoc } from './docs.dto';
import { sendPushEvent } from '@asaje/sse-push-event-server';

@SecureController('documents', 'Documents')
export class DocsController {
  constructor(private readonly service: DocsService) {}

  @Post()
  @ActionName("Création d'un nouveau documeent")
  async create(@Body() data: CreateDoc) {
    const result = await this.service.create(data);
    sendPushEvent({ event: 'documents.update', data: {} });
    return result;
  }

  @Get()
  @ActionName('Liste des documents')
  findAll() {
    return this.service.findAndCount({
      query: { enabled: true },
      paginationArgs: { limit: -1 },
    });
  }

  @Patch(':id')
  @ActionName("Modification d'un document")
  async update(@Param('id') id: string, @Body() data: UpdateDoc) {
    const result = await this.service.update(id, data);
    sendPushEvent({ event: 'documents.update', data: {} });
    return result;
  }

  @Patch(':id/view')
  @ActionName("Lecture d'un document")
  async view(@Param('id') id: string) {
    const result = await this.service.update(id, { views: { increment: 1 } });
    sendPushEvent({ event: 'documents.update', data: {} });
    return result;
  }

  @Patch(':id/download')
  @ActionName("Lecture d'un document")
  async download(@Param('id') id: string) {
    const result = await this.service.update(id, {
      downloads: { increment: 1 },
    });
    sendPushEvent({ event: 'documents.update', data: {} });
    return result;
  }

  @Delete(':id')
  @ActionName("Archivage d'un document")
  async remove(@Param('id') id: string) {
    const result = await this.service.archive(id);
    sendPushEvent({ event: 'documents.update', data: {} });
    return result;
  }

  @Delete(':id/force')
  @ActionName("Suppression d'un document")
  async delete(@Param('id') id: string) {
    const result = await this.service.delete(id);
    sendPushEvent({ event: 'documents.update', data: {} });
    return result;
  }
}
