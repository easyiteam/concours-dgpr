import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateValidator {
  @ApiProperty() @IsString() fullname: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty() @IsString() fonction: string;
}

export class UpdateValidator {
  @ApiPropertyOptional() @IsOptional() @IsString() fullname?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() fonction?: string;
}

export class DefinePin {
  @ApiProperty() @IsString() @MinLength(6) pin: string;
}
