import { PaginationDto } from '@app/common';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FindUsersDto extends IntersectionType(PaginationDto) {
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
  phone?: string;

  @ApiProperty({
    description: 'Find By #',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Find By #',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  company?: string;

  @ApiProperty({
    minimum: 1,
    default: 10,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(50)
  limit: number;

  @ApiProperty({
    minimum: 1,
    default: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page: number;
}
