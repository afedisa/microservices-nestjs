import { PickType } from '@nestjs/swagger';
import { BaseQueueCategoryDto } from './base-queue-category.dto';

export class CreateQueueCategoryDto extends PickType(BaseQueueCategoryDto, [
  'title',
]) {}
