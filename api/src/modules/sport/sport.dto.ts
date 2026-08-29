import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum GlobalPerformanceType {
  RACE = 'RACE',
  RACE_1000 = 'RACE_1000',
  CLIMBING = 'CLIMBING',
}

export class RegisterPresence {
  @ApiProperty() @IsString() reference: string;
}

export class RegisterPerformance {
  @ApiProperty() @IsString() reference: string;
  @ApiProperty({ enum: GlobalPerformanceType })
  @IsEnum(GlobalPerformanceType)
  type: GlobalPerformanceType;

  @ApiProperty() @IsString() value: string;
}

export class UpdatePerformance {
  @ApiProperty() @IsString() reference: string;
  @ApiPropertyOptional({ enum: GlobalPerformanceType })
  @IsOptional()
  @IsEnum(GlobalPerformanceType)
  type?: GlobalPerformanceType;
  @ApiPropertyOptional() @IsOptional() @IsString() value?: string;
}
