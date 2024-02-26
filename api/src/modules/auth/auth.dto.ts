import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BasicRole } from '@prisma/client';
import { IsEmail, IsOptional } from 'class-validator';

export class BasicAuthId {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  fullname?: string;
}

export class Link {
  @ApiProperty() exam: string;
  @ApiProperty() filter: string;
  @ApiProperty() value: string;
}

export class BasicAuthRegister extends BasicAuthId {
  @ApiProperty({ enum: BasicRole })
  role?: BasicRole;

  @ApiPropertyOptional({ type: [Link] }) links?: Link[];
}

export class BasicAuthCredentials extends BasicAuthId {
  @ApiProperty()
  password: string;
}

export class BasicAuthSetPassword {
  @ApiProperty() id: string;
  @ApiProperty() password: string;
}
