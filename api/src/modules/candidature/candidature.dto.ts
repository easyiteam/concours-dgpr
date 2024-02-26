import { Pagination } from '@app/shared/types/pagination';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CandidatureStatus } from '@prisma/client';

export class CreateCandidature {
  @ApiProperty() data: Record<string, string | number>;
  @ApiProperty() examId: string;
}

export class UpdateCandidature {
  @ApiPropertyOptional() data?: Record<string, string | number>;
  @ApiPropertyOptional() examId?: string;
}

export class CandidaturePagination extends Pagination {
  @ApiPropertyOptional() status?: CandidatureStatus;
}

export class CandidatureDownloadPagination extends CandidaturePagination {
  @ApiPropertyOptional() center?: string;
}

export class RejectCandidature {
  @ApiProperty() reason: string;
}

export const candidatureStatusLabel = {
  [CandidatureStatus.INDETERMINATE]: 'en attente',
  [CandidatureStatus.ACCEPTED]: 'acceptés',
  [CandidatureStatus.REJECTED]: 'rejetés',
};
