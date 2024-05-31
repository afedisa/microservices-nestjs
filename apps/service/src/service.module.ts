import { Module } from '@nestjs/common';
import { ServiceController } from './controller/service.controller';
import { ServiceService } from './service/service.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { ServiceEntity } from './entity/service.entity';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [ServiceEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.SERVICE),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
