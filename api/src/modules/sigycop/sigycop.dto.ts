import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class RegisterSigycopProfile {
  @ApiProperty() @IsString() reference: string;
  @ApiProperty() @IsString() centerId: string;

  @ApiProperty() @IsInt() @Min(1) @Max(6) s: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) i: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) g: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) y: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) c: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) o: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) p: number;
}

export class SigycopThresholds {
  @ApiProperty() @IsInt() @Min(1) @Max(6) s: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) i: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) g: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) y: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) c: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) o: number;
  @ApiProperty() @IsInt() @Min(1) @Max(6) p: number;
}
