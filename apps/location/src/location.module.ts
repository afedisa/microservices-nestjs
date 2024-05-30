import { Module } from '@nestjs/common';
import { LocationController } from './controller/location.controller';
import { LocationService } from './service/location.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { LocationEntity } from './entity/location.entity';
import { LocationCategoryEntity } from './entity/location-category.entity';
import { LocationInvitationEntity } from './entity/location-invitation.entity';
import { LocationInvitationService } from './service/location-invitation.service';
import { LocationMemberService } from './service/location-member.service';
import { LocationMemberEntity } from './entity/location-member.entity';
import { LocationInvitationController } from './controller/location-invitation.controller';
import { LocationMemberController } from './controller/location-member.controller';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      LocationEntity,
      LocationMemberEntity,
      LocationCategoryEntity,
      LocationInvitationEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.LOCATION),
  ],
  controllers: [
    LocationController,
    LocationInvitationController,
    LocationMemberController,
  ],
  providers: [LocationService, LocationInvitationService, LocationMemberService],
})
export class LocationModule {}
