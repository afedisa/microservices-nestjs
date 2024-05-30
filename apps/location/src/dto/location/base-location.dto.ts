import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class BaseLocationDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @Length(2, 30)
  name: string;

  @ApiProperty({
    minLength: 0,
    maxLength: 255,
  })
  @IsString()
  @Length(0, 255)
  description: string;

  @ApiProperty({
    minLength: 0,
    maxLength: 255,
  })
  @IsString()
  @Length(0, 255)
  address: string;

  @ApiProperty()
  @IsPhoneNumber('IR')
  phone: string;

  @ApiProperty()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    minLength: 0,
    maxLength: 255,
  })
  @IsString()
  @Length(0, 255)
  logo: string;
  @ApiProperty({
    minLength: 0,
    maxLength: 255,
  })
  @IsString()
  @Length(0, 255)
  background: string;

  @ApiProperty({
    minLength: 0,
    maxLength: 255,
  })
  @IsString()
  @Length(0, 255)
  style: string;

  @ApiProperty()
  @Transform(({ value }) => new Date(Date.parse(value)))
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @Transform(({ value }) => new Date(Date.parse(value)))
  @IsDate()
  updatedAt: Date;
}
