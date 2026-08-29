import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateExam {
  @ApiProperty() @IsString() label: string;
  @ApiProperty() @IsObject() participantProfileDefinition: Record<string, any>;
  @ApiProperty() @IsString() shortName: string;
}

export class UpdateExam {
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() participantProfileDefinition?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsString() shortName?: string;
}

export class CreateCenter {
  @ApiProperty() @IsString() label: string;
  @ApiProperty() @IsString() examId: string;
}

export class UpdateCenter {
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() examId?: string;
}
