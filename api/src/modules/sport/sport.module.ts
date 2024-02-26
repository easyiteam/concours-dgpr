import { Module } from '@nestjs/common';
import { SportService } from './sport.service';
import { SportController } from './sport.controller';
import { PrismaModule } from '@app/prisma';
import { CandidatureService } from '../candidature/candidature.service';
import { EmailModule } from '@app/email';

@Module({
  providers: [SportService, CandidatureService],
  controllers: [SportController],
  imports: [PrismaModule, EmailModule],
})
export class SportModule {}
