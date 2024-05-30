import { PickType } from '@nestjs/swagger';
import { BaseServiceDto } from './base-service.dto';

export class CreateServiceDto extends PickType(BaseServiceDto, [
  'name',
  'description',
]) {}
