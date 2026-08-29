import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDoc {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() url: string;
  @ApiProperty() @IsNumber() size: number;
  @ApiPropertyOptional() @IsOptional() @IsString() at?: string;
}

export class UpdateDoc {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() url?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() size?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() at?: string;
}
