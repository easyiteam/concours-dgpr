import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { EmailModule } from '@app/email';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { PrismaModule } from '@app/prisma';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/guards/role.guard';
import { routesToExclude } from './app.route-exclude';
import { ExamModule } from '../exam/exam.module';
import { StepModule } from '../step/step.module';
import { DocsModule } from '../docs/docs.module';
import { CandidatureModule } from '../candidature/candidature.module';
import { SportModule } from '../sport/sport.module';
import { ValidatorModule } from '../validator/validator.module';
import { WritingModule } from '../writing/writing.module';
import { FieldsModule } from '../fields/fields.module';

@Module({
  imports: [
    AuthModule,
    UploadModule,
    EmailModule,
    PrismaModule,
    ExamModule,
    StepModule,
    DocsModule,
    CandidatureModule,
    SportModule,
    ValidatorModule,
    WritingModule,
    FieldsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...routesToExclude)
      .forRoutes('*');
  }
}
