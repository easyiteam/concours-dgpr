import { PrismaService } from '@app/prisma';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Auth, Prisma } from '@prisma/client';

import { AuthAction, AuthErrorStatus } from './auth.enum';
import { HandleError } from '@app/decorators';
import { compare, hash } from 'bcrypt';
import { sign, verify } from '@asaje/token-generator';
import { Env } from '@app/shared';
import { createHmac } from 'crypto';
import {
  BasicAuthCredentials,
  BasicAuthRegister,
  BasicAuthSetPassword,
} from './auth.dto';
import { AuthMessages, AuthViews } from './auth.constants';
import { EmailService } from '@app/email';

@Injectable()
export class AuthService extends PrismaGenericRepository<
  Prisma.AuthDelegate<any>,
  Auth,
  Prisma.AuthUncheckedCreateInput,
  Prisma.AuthUncheckedUpdateInput,
  Prisma.AuthWhereInput,
  Prisma.AuthSelect
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {
    super();
    this.model = this.prisma.auth;
  }

  private getTokenSecret(): string {
    if (!Env.auth.tokenSecret) {
      throw new Error('AUTH_TOKEN_SECRET is not configured');
    }

    return Env.auth.tokenSecret;
  }

  async handleUsernameAlreadyExists(username: string) {
    const _username = await this.get({ username });

    if (_username && username)
      throw new ConflictException(AuthErrorStatus.USERNAME_ALREADY_EXISTS);
  }

  async handleEmailAlreadyExists(email: string) {
    const _email = await this.get({ email });

    if (_email)
      throw new ConflictException(AuthErrorStatus.EMAIL_ALREADY_EXISTS);
  }

  @HandleError()
  async register({ email, username, role, fullname }: BasicAuthRegister) {
    await this.handleEmailAlreadyExists(email);
    await this.handleUsernameAlreadyExists(username);

    return await this.create({
      email,
      role,
      ...(username ? { username } : {}),
      ...(fullname ? { fullname } : {}),
    });
  }

  private getPasswordVersion(password: string | null): string {
    return createHmac('sha256', this.getTokenSecret())
      .update(password ?? '')
      .digest('hex');
  }

  async setPassword({ id, password, token }: BasicAuthSetPassword) {
    let tokenData: {
      id: string;
      action: AuthAction;
      passwordVersion: string;
    };
    const tokenSecret = this.getTokenSecret();

    try {
      tokenData = verify<{
        id: string;
        action: AuthAction;
        passwordVersion: string;
      }>({ key: tokenSecret, token });
    } catch {
      throw new BadRequestException('Lien invalide ou expiré');
    }

    const auth = await this.getById(id);
    if (
      !auth ||
      !auth.enabled ||
      tokenData.id !== auth.id ||
      !Object.values(AuthAction).includes(tokenData.action) ||
      tokenData.passwordVersion !== this.getPasswordVersion(auth.password) ||
      (tokenData.action === AuthAction.DEFINE_PASSWORD && auth.password)
    ) {
      throw new BadRequestException('Lien invalide ou expiré');
    }

    const hashedPassword = await hash(password, 12);

    return await this.update(id, {
      password: hashedPassword,
      isVerified: true,
    });
  }

  @HandleError()
  async login({ email, username, password }: BasicAuthCredentials) {
    const user = await this.get({ OR: [{ email }, { username }] });

    if (!user || !(await compare(password, user.password))) {
      return null;
    }

    const token = sign({
      key: this.getTokenSecret(),
      data: { id: user.id },
      expiresIn: Env.auth.tokenExpiration,
    });

    return {
      token,
      credentials: {
        email: user.email,
        username: user.username,
        id: user.id,
        role: user.role,
      },
    };
  }

  async generateAndSendUrl(
    host: string,
    auth: Auth,
    action: AuthAction,
    template: string,
  ): Promise<void> {
    const token = sign({
      key: this.getTokenSecret(),
      data: {
        id: auth.id,
        action,
        passwordVersion: this.getPasswordVersion(auth.password),
      },
      // @asaje/token-generator counts expiresIn in milliseconds.
      expiresIn:
        action === AuthAction.RESET_PASSWORD
          ? 30 * 60 * 1000
          : 24 * 60 * 60 * 1000,
    });
    const url = `${host}/auth/${AuthViews.definePassword}/${auth.id}#token=${encodeURIComponent(token)}`;

    await this.email.sendEmail({
      subject: AuthMessages[action],
      to: auth.email,
      template,
      data: {
        username: auth.username ? auth.username : auth.email.split('@')[0],
        url,
      },
    });
  }

  @HandleError()
  async whoAmI(token: string) {
    const { id } = verify<{ id: string }>({
      key: this.getTokenSecret(),
      token,
    });
    const auth = await this.getById(id, { include: { exams: true } });
    delete auth.password;
    return auth;
  }
}
