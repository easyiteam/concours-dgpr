import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BasicRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export class BasicAuthId {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullname?: string;
}

export class Link {
  @ApiProperty() @IsString() exam: string;
  @ApiProperty() @IsString() filter: string;
  @ApiProperty() @IsString() value: string;
}

export class BasicAuthRegister extends BasicAuthId {
  @ApiProperty({ enum: BasicRole })
  @IsOptional()
  @IsEnum(BasicRole)
  role?: BasicRole;

  @ApiPropertyOptional({ type: [Link] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Link)
  links?: Link[];
}

export class BasicAuthCredentials extends BasicAuthId {
  @ApiProperty()
  @IsString()
  password: string;
}

export class BasicAuthSetPassword {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsString() password: string;
}
