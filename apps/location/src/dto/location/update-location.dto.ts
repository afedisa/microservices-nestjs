import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { BaseLocationDto } from './base-location.dto';

export class UpdateLocationDto extends IntersectionType(
  OmitType(PartialType(BaseLocationDto), ['id']),
) {}
