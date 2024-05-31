import { Module } from '@nestjs/common';
import { TurnController } from './controller/turn.controller';
import { TurnService } from './service/turn.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { TurnEntity } from './entity/turn.entity';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [TurnEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.TURN),
  ],
  controllers: [TurnController],
  providers: [TurnService],
})
export class TurnModule {}
