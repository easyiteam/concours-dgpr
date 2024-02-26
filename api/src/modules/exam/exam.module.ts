import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { PrismaModule } from '@app/prisma';

@Module({
  providers: [ExamService],
  controllers: [ExamController],
  imports: [PrismaModule],
})
export class ExamModule {}
