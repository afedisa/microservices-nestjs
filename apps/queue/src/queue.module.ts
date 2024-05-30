import { Module } from '@nestjs/common';
import { QueueController } from './controller/queue.controller';
import { QueueService } from './service/queue.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { QueueEntity } from './entity/queue.entity';
import { QueueCategoryEntity } from './entity/queue-category.entity';
import { QueueInvitationEntity } from './entity/queue-invitation.entity';
import { QueueInvitationService } from './service/queue-invitation.service';
import { QueueMemberService } from './service/queue-member.service';
import { QueueMemberEntity } from './entity/queue-member.entity';
import { QueueInvitationController } from './controller/queue-invitation.controller';
import { QueueMemberController } from './controller/queue-member.controller';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      QueueEntity,
      QueueMemberEntity,
      QueueCategoryEntity,
      QueueInvitationEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.QUEUE),
  ],
  controllers: [
    QueueController,
    QueueInvitationController,
    QueueMemberController,
  ],
  providers: [QueueService, QueueInvitationService, QueueMemberService],
})
export class QueueModule {}
