import { Controller } from '@nestjs/common';
import { QueueInvitationService } from '../service/queue-invitation.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QUEUE_INVITATION_MESSAGE_PATTERNS } from '../constant/queue-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { QueueInvitationEntity } from '../entity/queue-invitation.entity';
import { CreateQueueInvitationDto } from '../dto/invitation/create-queue-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';

@Controller()
export class QueueInvitationController {
  constructor(
    private queueInvitationService: QueueInvitationService,
  ) {}

  @MessagePattern(QUEUE_INVITATION_MESSAGE_PATTERNS.CREATE)
  async createInvitation(
    @Payload() createDto: CreateQueueInvitationDto,
  ): Promise<IServiceResponse<QueueInvitationEntity>> {
    return await this.queueInvitationService.create(createDto);
  }

  @MessagePattern(QUEUE_INVITATION_MESSAGE_PATTERNS.FIND_BY_ID)
  async getInvitationById(
    @Payload() id: string,
  ): Promise<IServiceResponse<QueueInvitationEntity>> {
    return await this.queueInvitationService.findById(id);
  }

  @MessagePattern(QUEUE_INVITATION_MESSAGE_PATTERNS.FIND_BY_ACTIVE_CODE)
  async getInvitationByCode(
    @Payload() code: string,
  ): Promise<IServiceResponse<QueueInvitationEntity>> {
    return await this.queueInvitationService.findByActiveCode(code);
  }

  @MessagePattern(QUEUE_INVITATION_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<QueueInvitationEntity>,
  ): Promise<IServiceResponse<QueueInvitationEntity>> {
    return await this.queueInvitationService.update(id, updateDto);
  }

  @MessagePattern(QUEUE_INVITATION_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<QueueInvitationEntity>> {
    return await this.queueInvitationService.remove(id);
  }

  @MessagePattern(QUEUE_INVITATION_MESSAGE_PATTERNS.USE)
  async useInvitation(
    @Payload('code') code: string,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.queueInvitationService.use(code, user);
  }
}
