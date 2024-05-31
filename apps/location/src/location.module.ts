import { Module } from '@nestjs/common';
import { LocationController } from './controller/location.controller';
import { LocationService } from './service/location.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { LocationEntity } from './entity/location.entity';
import { LocationMemberEntity } from './entity/location-member.entity';
import { LocationMemberController } from './controller/location-member.controller';
import { LocationMemberService } from './service/location-member.service';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      LocationEntity,
      LocationMemberEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.LOCATION),
  ],
  controllers: [LocationController, LocationMemberController],
  providers: [LocationService, LocationMemberService],
})
export class LocationModule {}
