import { PickType } from '@nestjs/swagger';
import { BaseQueueDto } from './base-queue.dto';

export class CreateQueueDto extends PickType(BaseQueueDto, [
  'name',
  'description',
]) {}
