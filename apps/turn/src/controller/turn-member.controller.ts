import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TURN_MEMBER_MESSAGE_PATTERNS } from '../constant/turn-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { TurnMemberService } from '../service/turn-member.service';
import { TurnEntity } from '../entity/turn.entity';
import { TurnMemberEntity } from '../entity/turn-member.entity';

@Controller()
export class TurnMemberController {
  constructor(private turnMemberService: TurnMemberService) {}

  @MessagePattern(TURN_MEMBER_MESSAGE_PATTERNS.CREATE)
  async createMember(
    @Payload('turn') turn: TurnEntity,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<TurnMemberEntity>> {
    return await this.turnMemberService.create(turn, user);
  }

  @MessagePattern(TURN_MEMBER_MESSAGE_PATTERNS.FIND_ALL)
  async getMembers(
    @Payload() turn: TurnEntity,
  ): Promise<IServiceResponse<TurnMemberEntity[]>> {
    return await this.turnMemberService.findAll(turn);
  }

  @MessagePattern(TURN_MEMBER_MESSAGE_PATTERNS.FIND_BY_USER)
  async getMemberByUser(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<TurnMemberEntity>> {
    return await this.turnMemberService.findByUser(user);
  }

  @MessagePattern(TURN_MEMBER_MESSAGE_PATTERNS.REMOVE)
  async removeMember(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<TurnMemberEntity>> {
    return await this.turnMemberService.remove(user);
  }

  @MessagePattern(TURN_MEMBER_MESSAGE_PATTERNS.is_UNEMPLOYED)
  async getUserIsUnemployed(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.turnMemberService.isUnemployed(user);
  }
}
