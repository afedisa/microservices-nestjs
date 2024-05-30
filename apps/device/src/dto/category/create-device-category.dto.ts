import { PickType } from '@nestjs/swagger';
import { BaseDeviceCategoryDto } from './base-device-category.dto';

export class CreateDeviceCategoryDto extends PickType(BaseDeviceCategoryDto, [
  'title',
]) {}
