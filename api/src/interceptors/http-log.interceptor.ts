import { ACTION_NAME } from '@app/decorators';
import { PrismaService } from '@app/prisma';
import { ExecutionRequest } from '@app/shared';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import * as chalk from 'chalk';
import { Observable, map } from 'rxjs';

function redactSensitiveValues(value: unknown): Prisma.InputJsonValue {
  if (Array.isArray(value)) {
    return value.map(redactSensitiveValues);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        /password|token|secret|authorization/i.test(key)
          ? '[REDACTED]'
          : redactSensitiveValues(child),
      ]),
    );
  }

  return value as Prisma.InputJsonValue;
}

@Injectable()
export class HttpLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest() as ExecutionRequest;
    const reflector = new Reflector();

    return next.handle().pipe(
      map((data: any) => {
        const action = reflector.get(ACTION_NAME, context.getHandler());
        this.prisma.httpLog
          .create({
            data: {
              action: action ?? 'Action inconnue',
              method: req.method,
              url: req.path,
              authorId: req.auth?.id ?? data?.credentials?.id ?? 'Unknown',
              query: redactSensitiveValues(req.query),
              params: redactSensitiveValues(req.params),
              body: redactSensitiveValues(req.body),
              ip: req.ip,
            },
          })
          .catch((e) => {
            console.log(
              chalk.redBright(
                `[ERROR] - ${
                  HttpLogInterceptor.name
                } - ${new Date().toLocaleString()} ${e.message}`,
              ),
            );
          });

        return data;
      }),
    );
  }
}
