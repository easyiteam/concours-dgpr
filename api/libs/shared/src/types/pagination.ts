import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class Pagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  take?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  skip?: number;
}
