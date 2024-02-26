import { PrismaService } from '@app/prisma';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import { Injectable } from '@nestjs/common';
import { Exam, Prisma } from '@prisma/client';
import { CreateCenter } from './exam.dto';

@Injectable()
export class ExamService extends PrismaGenericRepository<
  Prisma.ExamDelegate<any>,
  Exam,
  Prisma.ExamUncheckedCreateInput,
  Prisma.ExamUncheckedUpdateInput,
  Prisma.ExamWhereInput,
  Prisma.ExamSelect
> {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.model = this.prisma.exam;
  }

  async createCenter(center: CreateCenter) {
    return await this.prisma.center.create({
      data: { label: center.label, examId: center.examId },
    });
  }

  async getCenters(examId: string) {
    const values = await this.prisma.center.findMany({ where: { examId } });
    const count = await this.prisma.center.count({ where: { examId } });

    return { count, values };
  }

  async updateCenter(centerId: string, data: Partial<CreateCenter>) {
    return await this.prisma.center.update({ where: { id: centerId }, data });
  }

  async deleteCenter(centerId: string) {
    return await this.prisma.center.delete({ where: { id: centerId } });
  }
}
