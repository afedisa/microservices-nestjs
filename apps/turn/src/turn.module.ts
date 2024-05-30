import { Module } from '@nestjs/common';
import { TurnController } from './controller/turn.controller';
import { TurnService } from './service/turn.service';
import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { Database, DatabaseModule } from '@app/database';
import { TurnEntity } from './entity/turn.entity';
import { TurnCategoryEntity } from './entity/turn-category.entity';
import { TurnInvitationEntity } from './entity/turn-invitation.entity';
import { TurnInvitationService } from './service/turn-invitation.service';
import { TurnMemberService } from './service/turn-member.service';
import { TurnMemberEntity } from './entity/turn-member.entity';
import { TurnInvitationController } from './controller/turn-invitation.controller';
import { TurnMemberController } from './controller/turn-member.controller';

@Module({
  imports: [
    DatabaseModule.register(Database.PRIMARY),
    DatabaseModule.forEntity(Database.PRIMARY, [
      TurnEntity,
      TurnMemberEntity,
      TurnCategoryEntity,
      TurnInvitationEntity,
    ]),
    RabbitModule.forServerProxy(RabbitServiceName.TURN),
  ],
  controllers: [
    TurnController,
    TurnInvitationController,
    TurnMemberController,
  ],
  providers: [TurnService, TurnInvitationService, TurnMemberService],
})
export class TurnModule {}
