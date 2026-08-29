import { Pagination } from '@app/shared/types/pagination';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CandidatureStatus } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCandidature {
  @ApiProperty() @IsObject() data: Record<string, string | number>;
  @ApiProperty() @IsString() examId: string;
}

export class UpdateCandidature {
  @ApiPropertyOptional() @IsOptional() @IsObject() data?: Record<string, string | number>;
  @ApiPropertyOptional() @IsOptional() @IsString() examId?: string;
}

export class CandidaturePagination extends Pagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(CandidatureStatus)
  status?: CandidatureStatus;
}

export class CandidatureDownloadPagination extends CandidaturePagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  center?: string;
}

export class RejectCandidature {
  @ApiProperty() @IsString() reason: string;
}

export const candidatureStatusLabel = {
  [CandidatureStatus.INDETERMINATE]: 'en attente',
  [CandidatureStatus.ACCEPTED]: 'acceptés',
  [CandidatureStatus.REJECTED]: 'rejetés',
};
