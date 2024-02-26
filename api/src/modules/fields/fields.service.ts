import { PrismaService } from '@app/prisma';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import { Injectable } from '@nestjs/common';
import { Field, Prisma } from '@prisma/client';

@Injectable()
export class FieldsService extends PrismaGenericRepository<
  Prisma.FieldDelegate<any>,
  Field,
  Prisma.FieldUncheckedCreateInput,
  Prisma.FieldUncheckedUpdateInput,
  Prisma.FieldWhereInput,
  Prisma.FieldSelect
> {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.model = this.prisma.field;
  }
}
