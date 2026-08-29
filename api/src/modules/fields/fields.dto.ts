import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateField {
  @ApiProperty() @IsString() code: string;
  @ApiProperty() @IsString() label: string;
  @ApiProperty() @IsNumber() coefficient: number;
  @ApiProperty() @IsString() examId: string;
}

export class UpdateField {
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() coefficient?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() examId?: string;
}
