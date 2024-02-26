import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateValidator {
  @ApiProperty() fullname: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty() fonction: string;
}

export class UpdateValidator {
  @ApiPropertyOptional() fullname?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional() fonction?: string;
}

export class DefinePin {
  @ApiProperty() @MinLength(6) pin: string;
}
