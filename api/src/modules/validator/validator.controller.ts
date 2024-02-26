import { CurrentHost, SecureController } from '@app/decorators';
import { ValidatorService } from './validator.service';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  UnauthorizedException,
} from '@nestjs/common';
import { sendPushEvent } from '@asaje/sse-push-event-server';
import { CreateValidator, DefinePin } from './validator.dto';
import { Validator, ValidatorStatus } from '@prisma/client';
import { hash } from 'bcrypt';
import { ValidatorViews } from './validator.constants';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

const event = 'validators.update';

@SecureController('validators', "Validateurs d'examen")
export class ValidatorController {
  constructor(private readonly service: ValidatorService) {}

  @ApiExcludeEndpoint()
  @Get('define-pin/:id')
  @Render('define-pin')
  definePasswordView() {
    return {};
  }

  @ApiExcludeEndpoint()
  @Get('accept-revocation/:id')
  @Render('accept-revocation')
  acceptRevoationView() {
    return {};
  }

  @ApiExcludeEndpoint()
  @Get('accept-validation/:id')
  @Render('validate-validation')
  acceptValidationView() {
    return {};
  }

  @Post()
  async addValidator(
    @Body() data: CreateValidator,
    @CurrentHost() host: string,
  ) {
    const validator: Validator = await this.service.create(data);
    await this.service.notifyByEmail(
      validator.id,
      ValidatorViews.definePin,
      host,
    );
    sendPushEvent({ event, data: validator });
    return validator;
  }

  @Patch(':id/define-pin')
  async definePin(@Body() { pin }: DefinePin, @Param('id') id: string) {
    const result = await this.service.update(id, {
      pin: await hash(pin, 3),
      status: ValidatorStatus.ACTIVE,
    });

    sendPushEvent({ event, data: result });
    return result;
  }

  @Get()
  async getValidators() {
    const validators = await this.service.find({});
    return validators.map((validator) => ({ ...validator, pin: undefined }));
  }

  @Delete(':id/revocate')
  async revocateValidator(
    @Param('id') id: string,
    @CurrentHost() host: string,
  ) {
    const validator: Validator = await this.service.update(id, {
      status: ValidatorStatus.REVOCATING,
    });
    await this.service.notifyByEmail(
      validator.id,
      ValidatorViews.acceptRevocation,
      host,
    );
    sendPushEvent({ event, data: {} });
    return { ...validator, pin: undefined };
  }

  @Patch(':id/confirm-revocation')
  async confirmRevocation(@Param('id') id: string, @Body('pin') pin: string) {
    const isValidPin = await this.service.verifyPin(id, pin);
    if (!isValidPin) {
      throw new UnauthorizedException('Invalid pin');
    }
    const result = await this.service.update(id, {
      status: ValidatorStatus.REVOCATED,
    });
    sendPushEvent({ event, data: {} });
    return result;
  }

  @Patch('validation/:id/confirm')
  async confirmValidation(@Param('id') id: string, @Body('pin') pin: string) {
    console.log(id, pin);
    await this.service.verifyValidation(id, pin);
    sendPushEvent({ event, data: {} });
  }

  @Post('init-process')
  async initValidationProcess(@CurrentHost() host: string) {
    return await this.service.createValidationProcess(host);
  }

  @Get('validation-status/:id')
  async getValidationStatus(@Param('id') id: string) {
    return await this.service.getValidationStatus(id);
  }
}
