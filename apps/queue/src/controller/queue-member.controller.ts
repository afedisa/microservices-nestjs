import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QUEUE_MEMBER_MESSAGE_PATTERNS } from '../constant/queue-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { QueueMemberService } from '../service/queue-member.service';
import { QueueEntity } from '../entity/queue.entity';
import { QueueMemberEntity } from '../entity/queue-member.entity';

@Controller()
export class QueueMemberController {
  constructor(private queueMemberService: QueueMemberService) {}

  @MessagePattern(QUEUE_MEMBER_MESSAGE_PATTERNS.CREATE)
  async createMember(
    @Payload('queue') queue: QueueEntity,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<QueueMemberEntity>> {
    return await this.queueMemberService.create(queue, user);
  }

  @MessagePattern(QUEUE_MEMBER_MESSAGE_PATTERNS.FIND_ALL)
  async getMembers(
    @Payload() queue: QueueEntity,
  ): Promise<IServiceResponse<QueueMemberEntity[]>> {
    return await this.queueMemberService.findAll(queue);
  }

  @MessagePattern(QUEUE_MEMBER_MESSAGE_PATTERNS.FIND_BY_USER)
  async getMemberByUser(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<QueueMemberEntity>> {
    return await this.queueMemberService.findByUser(user);
  }

  @MessagePattern(QUEUE_MEMBER_MESSAGE_PATTERNS.REMOVE)
  async removeMember(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<QueueMemberEntity>> {
    return await this.queueMemberService.remove(user);
  }

  @MessagePattern(QUEUE_MEMBER_MESSAGE_PATTERNS.is_UNEMPLOYED)
  async getUserIsUnemployed(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.queueMemberService.isUnemployed(user);
  }
}
