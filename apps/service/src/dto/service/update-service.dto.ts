import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { BaseServiceDto } from './base-service.dto';

export class UpdateServiceDto extends IntersectionType(
  OmitType(PartialType(BaseServiceDto), ['id']),
) {}
