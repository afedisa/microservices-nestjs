import { Module } from '@nestjs/common';
import { DeviceController } from './controller/device.controller';
import { DeviceService } from './service/device.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { DeviceEntity } from './entity/device.entity';
import { DeviceCategoryEntity } from './entity/device-category.entity';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      DeviceEntity,
      DeviceCategoryEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.DEVICE),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
