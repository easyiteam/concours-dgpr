import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum GlobalPerformanceType {
  RACE = 'RACE',
  RACE_1000 = 'RACE_1000',
  CLIMBING = 'CLIMBING',
}

export class RegisterPresence {
  @ApiProperty() reference: string;
}

export class RegisterPerformance {
  @ApiProperty() reference: string;
  @ApiProperty({ enum: GlobalPerformanceType }) type: GlobalPerformanceType;

  @ApiProperty() value: string;
}

export class UpdatePerformance {
  @ApiProperty() reference: string;
  @ApiPropertyOptional({ enum: GlobalPerformanceType })
  type?: GlobalPerformanceType;
  @ApiPropertyOptional() value?: string;
}
