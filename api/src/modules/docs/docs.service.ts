import { PrismaService } from '@app/prisma';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import { Injectable } from '@nestjs/common';
import { Docs, Prisma } from '@prisma/client';

@Injectable()
export class DocsService extends PrismaGenericRepository<
  Prisma.DocsDelegate<any>,
  Docs,
  Prisma.DocsUncheckedCreateInput,
  Prisma.DocsUncheckedUpdateInput,
  Prisma.DocsWhereInput,
  Prisma.DocsSelect
> {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.model = this.prisma.docs;
  }

  async incrementViews(id: string) {
    return await this.update(id, { views: { increment: 1 } });
  }

  async incrementDownloads(id: string) {
    return await this.update(id, { downloads: { increment: 1 } });
  }
}
