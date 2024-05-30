import { PickType } from '@nestjs/swagger';
import { BaseTurnDto } from './base-turn.dto';

export class CreateTurnDto extends PickType(BaseTurnDto, [
  'name',
  'description',
]) {}
