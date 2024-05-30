import { PickType } from '@nestjs/swagger';
import { BaseLocationDto } from './base-location.dto';

export class CreateLocationDto extends PickType(BaseLocationDto, [
  'name',
  'description',
]) {}
