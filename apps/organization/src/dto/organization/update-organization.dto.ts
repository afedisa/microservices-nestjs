import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { BaseOrganizationDto } from './base-organization.dto';

export class UpdateOrganizationDto extends IntersectionType(
  OmitType(PartialType(BaseOrganizationDto), ['id']),
) {}
