import { PaginationDto } from '@app/common';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FindCompaniesDto extends IntersectionType(PaginationDto) {
  @ApiProperty({
    description: 'Find By #',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'Find By #',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Find By #',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  enabled: boolean;

  @ApiProperty({
    minimum: 10,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(10)
  @Max(50)
  limit: number;

  @ApiProperty({
    minimum: 0,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page: number;
}
