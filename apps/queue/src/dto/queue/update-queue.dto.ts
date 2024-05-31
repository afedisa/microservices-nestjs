import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { BaseQueueDto } from './base-queue.dto';

export class UpdateQueueDto extends IntersectionType(
  OmitType(PartialType(BaseQueueDto), ['id']),
) {}
