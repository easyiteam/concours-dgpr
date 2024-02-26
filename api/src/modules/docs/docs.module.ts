import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { PrismaModule } from '@app/prisma';

@Module({
  controllers: [DocsController],
  providers: [DocsService],
  imports: [PrismaModule],
})
export class DocsModule {}
