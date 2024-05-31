import { Module } from '@nestjs/common';
import { QueueController } from './controller/queue.controller';
import { QueueService } from './service/queue.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { QueueEntity } from './entity/queue.entity';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [QueueEntity]),
    RabbitModule.forServerProxy(RabbitServiceName.QUEUE),
  ],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
