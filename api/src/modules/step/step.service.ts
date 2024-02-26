import { PrismaService } from '@app/prisma';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import { Injectable } from '@nestjs/common';
import { Prisma, Step } from '@prisma/client';

@Injectable()
export class StepService extends PrismaGenericRepository<
  Prisma.StepDelegate<any>,
  Step,
  Prisma.StepUncheckedCreateInput,
  Prisma.StepUncheckedUpdateInput,
  Prisma.StepWhereInput,
  Prisma.StepSelect
> {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.model = this.prisma.step;
  }

  async activateStep(id: string) {
    const step = await this.getById(id);
    const steps = await this.find({
      query: { examId: step.examId },
      paginationArgs: { limit: -1 },
    });
    const query = steps.map((step) => ({
      id: step.id,
      data: { active: false },
    }));
    await this.updateMany(query);
    return await this.update(id, { active: true });
  }
}
