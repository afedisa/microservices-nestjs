import { Module } from '@nestjs/common';
import { OrganizationController } from './controller/organization.controller';
import { OrganizationService } from './service/organization.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { OrganizationEntity } from './entity/organization.entity';
import { OrganizationMemberService } from './service/organization-member.service';
import { OrganizationMemberEntity } from './entity/organization-member.entity';
import { OrganizationMemberController } from './controller/organization-member.controller';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      OrganizationEntity,
      OrganizationMemberEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.ORGANIZATION),
  ],
  controllers: [OrganizationController, , OrganizationMemberController],
  providers: [OrganizationService, OrganizationMemberService],
})
export class OrganizationModule {}
