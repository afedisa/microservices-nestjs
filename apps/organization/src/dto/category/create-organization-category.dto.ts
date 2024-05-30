import { PickType } from '@nestjs/swagger';
import { BaseOrganizationCategoryDto } from './base-organization-category.dto';

export class CreateOrganizationCategoryDto extends PickType(BaseOrganizationCategoryDto, [
  'title',
]) {}
