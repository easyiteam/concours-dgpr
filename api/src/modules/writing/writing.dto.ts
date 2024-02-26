import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateRepartition {
  @ApiProperty() examId: string;
  @ApiProperty() centerId: string;
  @ApiProperty() n: number;
}

export class GenerateCode {
  @ApiProperty() examId: string;
  @ApiProperty() fieldId: string;
}

export class InsertScore {
  @ApiProperty() code: string;

  @Min(0)
  @Max(20)
  @IsNumber()
  @ApiProperty()
  value: number;
}
