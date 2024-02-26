import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExam {
  @ApiProperty() label: string;
  @ApiProperty() participantProfileDefinition: Record<string, any>;
  @ApiProperty() shortName: string;
}

export class UpdateExam {
  @ApiPropertyOptional() label?: string;
  @ApiPropertyOptional() participantProfileDefinition?: Record<string, any>;
  @ApiPropertyOptional() shortName?: string;
}

export class CreateCenter {
  @ApiProperty() label: string;
  @ApiProperty() examId: string;
}

export class UpdateCenter {
  @ApiPropertyOptional() label?: string;
  @ApiPropertyOptional() examId?: string;
}
