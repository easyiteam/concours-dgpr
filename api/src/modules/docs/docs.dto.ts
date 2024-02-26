import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoc {
  @ApiProperty() title: string;
  @ApiProperty() description: string;
  @ApiProperty() url: string;
  @ApiProperty() size: number;
  @ApiPropertyOptional() at?: string;
}

export class UpdateDoc {
  @ApiPropertyOptional() title?: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() url?: string;
  @ApiPropertyOptional() size?: number;
  @ApiPropertyOptional() at?: string;
}
