import { PickType } from '@nestjs/swagger';
import { BaseServiceCategoryDto } from './base-service-category.dto';

export class CreateServiceCategoryDto extends PickType(BaseServiceCategoryDto, [
  'title',
]) {}
