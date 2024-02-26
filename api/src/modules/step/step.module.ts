import { Module } from '@nestjs/common';
import { StepService } from './step.service';
import { StepController } from './step.controller';
import { PrismaModule } from '@app/prisma';

@Module({
  providers: [StepService],
  controllers: [StepController],
  imports: [PrismaModule],
})
export class StepModule {}
