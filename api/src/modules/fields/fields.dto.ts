import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateField {
  @ApiProperty() code: string;
  @ApiProperty() label: string;
  @ApiProperty() coefficient: number;
  @ApiProperty() examId: string;
}

export class UpdateField {
  @ApiPropertyOptional() code?: string;
  @ApiPropertyOptional() label?: string;
  @ApiPropertyOptional() coefficient?: number;
  @ApiPropertyOptional() examId?: string;
}
