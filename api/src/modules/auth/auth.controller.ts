import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Render,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthViews } from './auth.constants';
import {
  ActionName,
  BasicRoles,
  CurrentHost,
  SecureController,
} from '@app/decorators';
import {
  BasicAuthCredentials,
  BasicAuthId,
  BasicAuthRegister,
  BasicAuthSetPassword,
} from './auth.dto';
import { AuthAction, AuthEmailTemplates } from './auth.enum';
import { AuthEntity } from './auth.entity';
import { Pagination } from '@app/shared/types/pagination';
import { CurrentAuth } from '@app/decorators/current-auth.decorator';
import { Auth, BasicRole } from '@prisma/client';
import { sendPushEvent } from '@asaje/sse-push-event-server';
import { PrismaService } from '@app/prisma';

@SecureController('auth', 'Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('register')
  @ActionName('User sign in')
  async register(@Body() data: BasicAuthRegister, @CurrentHost() host: string) {
    const links = data.links;
    delete data.links;
    const auth = await this.authService.register(data);

    if (links) {
      for (const link of links) {
        await this.prisma.authExam.create({
          data: {
            authId: auth.id,
            examId: link.exam,
            filter: link.filter,
            value: link.value,
          },
        });
      }
    }

    sendPushEvent({ event: 'auth.update', data: {} });

    return await this.authService.generateAndSendUrl(
      host,
      auth,
      AuthAction.DEFINE_PASSWORD,
      AuthEmailTemplates.DEFINE_YOUR_PASSWORD,
    );
  }

  @ApiExcludeEndpoint()
  @Get(AuthViews.definePassword + '/:id')
  @Render(AuthViews.definePassword)
  definePasswordView() {
    return {};
  }

  @Post(AuthViews.setPassword)
  @Render(AuthViews.setPassword)
  @ActionName('User define password')
  async setPassword(@Body() data: BasicAuthSetPassword) {
    const auth = await this.authService.setPassword(data);
    if (!auth) throw new NotFoundException('Unable to set password');
    sendPushEvent({ event: 'auth.update', data: {} });
    return { success: true };
  }

  @Post('login')
  @ActionName('User login')
  async login(@Body() data: BasicAuthCredentials) {
    const authInfo = await this.authService.login(data);
    if (!authInfo) throw new UnauthorizedException('Invalid credentials');
    return authInfo;
  }

  @Post(AuthViews.resetPassword)
  @ActionName('User request for password update')
  async resetPassword(
    @Body() { email, username }: BasicAuthId,
    @CurrentHost() host: string,
  ) {
    const auth = await this.authService.get({ OR: [{ email, username }] });
    if (!auth)
      throw new NotFoundException('Unable to reset password, user not found');

    return this.authService.generateAndSendUrl(
      host,
      auth,
      AuthAction.RESET_PASSWORD,
      AuthEmailTemplates.RESET_YOUR_PASSWORD,
    );
  }

  @Get()
  @ActionName('Get list of auths')
  @BasicRoles(BasicRole.ADMIN)
  async findAll(@Query() args: Pagination) {
    const auths = await this.authService.findAndCount({
      paginationArgs: args,
      paginationOptions: { search: ['fullname', 'email'] },
    });
    return {
      ...auths,
      values: auths.values.map((auth) => ({ ...auth, password: undefined })),
    };
  }

  @Get('me')
  @ActionName('Who am I')
  async whoAmI(@CurrentAuth() auth: Partial<Auth>) {
    return auth;
  }

  @Get(':id')
  @ActionName('Get auth info by id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: string) {
    const auth = await this.authService.getById(id);
    if (!auth) throw new NotFoundException();

    return new AuthEntity(auth);
  }

  @Patch(':id')
  @ActionName('Update auth info')
  async updateOne(@Param('id') id: string, @Body() data: BasicAuthRegister) {
    const auth = await this.authService.update(id, data);
    if (!auth) throw new NotFoundException();
    sendPushEvent({ event: 'auth.update', data: {} });

    return new AuthEntity(auth);
  }

  @Delete(':id')
  @ActionName('Archive auth')
  @BasicRoles(BasicRole.ADMIN)
  async archiveOne(@Param('id') id: string) {
    const result = await this.authService.archive(id);
    sendPushEvent({ event: 'auth.update', data: {} });
    return result;
  }

  @Delete(':id/force')
  @ActionName('Delete auth')
  @BasicRoles(BasicRole.ADMIN)
  async deleteOne(@Param('id') id: string) {
    const result = await this.authService.delete(id);
    sendPushEvent({ event: 'auth.update', data: {} });
    return result;
  }

  @Delete(':id/many')
  @BasicRoles(BasicRole.ADMIN)
  @ActionName('Archive multiple auth')
  async archiveMany(@Body() ids: string[]) {
    const result = await this.authService.archiveMany(ids);
    sendPushEvent({ event: 'auth.update', data: {} });
    return result;
  }

  @Delete(':id/many/force')
  @ActionName('Delete multiple auth')
  @BasicRoles(BasicRole.ADMIN)
  async deleteMany(@Body() ids: string[]) {
    const result = await this.authService.deleteMany(ids);
    sendPushEvent({ event: 'auth.update', data: {} });
    return result;
  }
}
