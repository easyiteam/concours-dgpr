import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateRepartition {
  @ApiProperty() @IsString() examId: string;
  @ApiProperty() @IsString() centerId: string;
  @ApiProperty() @IsNumber() n: number;
}

export class GenerateCode {
  @ApiProperty() @IsString() examId: string;
  @ApiProperty() @IsString() fieldId: string;
}

export class InsertScore {
  @ApiProperty() @IsString() code: string;

  @Min(0)
  @Max(20)
  @IsNumber()
  @ApiProperty()
  value: number;
}
