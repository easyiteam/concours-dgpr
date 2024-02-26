import { Module } from '@nestjs/common';
import { CandidatureController } from './candidature.controller';
import { CandidatureService } from './candidature.service';
import { PrismaModule } from '@app/prisma';
import { EmailModule } from '@app/email';

@Module({
  controllers: [CandidatureController],
  providers: [CandidatureService],
  imports: [PrismaModule, EmailModule],
})
export class CandidatureModule {}
