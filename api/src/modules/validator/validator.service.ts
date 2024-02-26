import { EmailService } from '@app/email';
import { PrismaService } from '@app/prisma';
import { Env } from '@app/shared';
import { PrismaGenericRepository } from '@asaje/prisma-generic-repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  Prisma,
  ValidationStatus,
  Validator,
  ValidatorStatus,
} from '@prisma/client';
import { compare } from 'bcrypt';
import {
  ValidatorSubject,
  ValidatorTemplates,
  ValidatorType,
  ValidatorViews,
} from './validator.constants';

@Injectable()
export class ValidatorService extends PrismaGenericRepository<
  Prisma.ValidatorDelegate<any>,
  Validator,
  Prisma.ValidatorUncheckedCreateInput,
  Prisma.ValidatorUncheckedUpdateInput,
  Prisma.ValidatorWhereInput,
  Prisma.ValidatorSelect
> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {
    super();
    this.model = this.prisma.validator;
  }

  async verifyPin(id: string, pin: string) {
    const validator = await this.getById(id, { select: { pin: true } });
    return await compare(pin, validator.pin);
  }

  async notifyByEmail(id: string, type: ValidatorViews, host: string) {
    const url = `${host}/validators/${type}/${id}`;
    const validator = await this.getById(id);

    await this.email.sendEmail({
      subject: ValidatorSubject[ValidatorType[type]],
      to: validator.email,
      template: ValidatorTemplates[ValidatorType[type]],
      data: { name: validator.fullname, url },
    });
  }

  async getActiveValidators() {
    return await this.find({
      query: { status: ValidatorStatus.ACTIVE },
    });
  }

  async countActiveValidators() {
    return await this.find({
      query: { status: ValidatorStatus.ACTIVE },
    });
  }

  async createValidationProcess(host: string) {
    const validation = await this.prisma.validation.create({ data: {} });
    const validators = await this.getActiveValidators();

    for (const validator of validators) {
      const validatorValidation = await this.prisma.validatorValidation.create({
        data: { validationId: validation.id, validatorId: validator.id },
      });
      await this.email.sendEmail({
        subject: ValidatorSubject.validate,
        to: validator.email,
        template: ValidatorTemplates.validate,
        data: {
          name: validator.fullname,
          url: `${host}/validators/accept-validation/${validatorValidation.id}`,
        },
      });
    }

    return validation;
  }

  async getValidationStatus(validationId: string) {
    const validatorValidations = await this.prisma.validatorValidation.findMany(
      {
        where: { validationId },
        include: { validation: true, validator: true },
      },
    );
    const notOk = await this.prisma.validatorValidation.count({
      where: {
        validationId,
        status: ValidationStatus.PENDING,
      },
    });
    return { validators: validatorValidations, success: notOk === 0 };
  }

  async verifyValidation(id: string, pin: string) {
    const validatorValidation =
      await this.prisma.validatorValidation.findUnique({ where: { id } });

    const isValidPin = await this.verifyPin(
      validatorValidation.validatorId,
      pin,
    );

    if (!isValidPin) {
      throw new UnauthorizedException('Invalid pin');
    }

    await this.prisma.validatorValidation.update({
      where: { id },
      data: { status: ValidationStatus.SUCCESS },
    });
  }
}
