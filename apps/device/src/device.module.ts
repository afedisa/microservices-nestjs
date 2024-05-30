import { Module } from '@nestjs/common';
import { DeviceController } from './controller/device.controller';
import { DeviceService } from './service/device.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { DeviceEntity } from './entity/device.entity';
import { DeviceCategoryEntity } from './entity/device-category.entity';
import { DeviceInvitationEntity } from './entity/device-invitation.entity';
import { DeviceInvitationService } from './service/device-invitation.service';
import { DeviceMemberService } from './service/device-member.service';
import { DeviceMemberEntity } from './entity/device-member.entity';
import { DeviceInvitationController } from './controller/device-invitation.controller';
import { DeviceMemberController } from './controller/device-member.controller';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      DeviceEntity,
      DeviceMemberEntity,
      DeviceCategoryEntity,
      DeviceInvitationEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.DEVICE),
  ],
  controllers: [
    DeviceController,
    DeviceInvitationController,
    DeviceMemberController,
  ],
  providers: [DeviceService, DeviceInvitationService, DeviceMemberService],
})
export class DeviceModule {}
