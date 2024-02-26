import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStep {
  @ApiProperty() label: string;
  @ApiProperty() order: number;
  @ApiProperty() examId: string;
}

export class UpdateStep {
  @ApiPropertyOptional() label?: string;
  @ApiPropertyOptional() order?: number;
  @ApiPropertyOptional() examId?: string;
}
