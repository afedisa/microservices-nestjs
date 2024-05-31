import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { BaseTurnDto } from './base-turn.dto';

export class UpdateTurnDto extends IntersectionType(
  OmitType(PartialType(BaseTurnDto), ['id']),
) {}
