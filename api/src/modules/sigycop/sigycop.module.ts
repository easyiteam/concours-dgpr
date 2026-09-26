import { Module } from '@nestjs/common';
import { SigycopService } from './sigycop.service';
import { SigycopController } from './sigycop.controller';
import { PrismaModule } from '@app/prisma';

@Module({
  providers: [SigycopService],
  controllers: [SigycopController],
  imports: [PrismaModule],
})
export class SigycopModule {}
