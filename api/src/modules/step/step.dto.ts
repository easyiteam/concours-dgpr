import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStep {
  @ApiProperty() @IsString() label: string;
  @ApiProperty() @IsNumber() order: number;
  @ApiProperty() @IsString() examId: string;
}

export class UpdateStep {
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() order?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() examId?: string;
}
