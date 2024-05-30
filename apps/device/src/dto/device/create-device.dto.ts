import { PickType } from '@nestjs/swagger';
import { BaseDeviceDto } from './base-device.dto';

export class CreateDeviceDto extends PickType(BaseDeviceDto, [
  'name',
  'description',
]) {}
