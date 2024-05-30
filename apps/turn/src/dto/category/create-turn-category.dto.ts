import { PickType } from '@nestjs/swagger';
import { BaseTurnCategoryDto } from './base-turn-category.dto';

export class CreateTurnCategoryDto extends PickType(BaseTurnCategoryDto, [
  'title',
]) {}
