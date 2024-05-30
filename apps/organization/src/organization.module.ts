import { Module } from '@nestjs/common';
import { OrganizationController } from './controller/organization.controller';
import { OrganizationService } from './service/organization.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { OrganizationEntity } from './entity/organization.entity';
import { OrganizationCategoryEntity } from './entity/organization-category.entity';
import { OrganizationInvitationEntity } from './entity/organization-invitation.entity';
import { OrganizationInvitationService } from './service/organization-invitation.service';
import { OrganizationMemberService } from './service/organization-member.service';
import { OrganizationMemberEntity } from './entity/organization-member.entity';
import { OrganizationInvitationController } from './controller/organization-invitation.controller';
import { OrganizationMemberController } from './controller/organization-member.controller';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      OrganizationEntity,
      OrganizationMemberEntity,
      OrganizationCategoryEntity,
      OrganizationInvitationEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.ORGANIZATION),
  ],
  controllers: [
    OrganizationController,
    OrganizationInvitationController,
    OrganizationMemberController,
  ],
  providers: [OrganizationService, OrganizationInvitationService, OrganizationMemberService],
})
export class OrganizationModule {}
