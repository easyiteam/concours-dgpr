import { Module } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { ValidatorController } from './validator.controller';
import { PrismaModule } from '@app/prisma';
import { EmailModule } from '@app/email';

@Module({
  providers: [ValidatorService],
  controllers: [ValidatorController],
  imports: [PrismaModule, EmailModule],
})
export class ValidatorModule {}
