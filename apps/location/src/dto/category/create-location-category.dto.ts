import { PickType } from '@nestjs/swagger';
import { BaseLocationCategoryDto } from './base-location-category.dto';

export class CreateLocationCategoryDto extends PickType(BaseLocationCategoryDto, [
  'title',
]) {}
