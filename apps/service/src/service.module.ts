import { Module } from '@nestjs/common';
import { ServiceController } from './controller/service.controller';
import { ServiceService } from './service/service.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { ServiceEntity } from './entity/service.entity';
import { ServiceCategoryEntity } from './entity/service-category.entity';
import { ServiceInvitationEntity } from './entity/service-invitation.entity';
import { ServiceInvitationService } from './service/service-invitation.service';
import { ServiceMemberService } from './service/service-member.service';
import { ServiceMemberEntity } from './entity/service-member.entity';
import { ServiceInvitationController } from './controller/service-invitation.controller';
import { ServiceMemberController } from './controller/service-member.controller';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      ServiceEntity,
      ServiceMemberEntity,
      ServiceCategoryEntity,
      ServiceInvitationEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.SERVICE),
  ],
  controllers: [
    ServiceController,
    ServiceInvitationController,
    ServiceMemberController,
  ],
  providers: [ServiceService, ServiceInvitationService, ServiceMemberService],
})
export class ServiceModule {}
