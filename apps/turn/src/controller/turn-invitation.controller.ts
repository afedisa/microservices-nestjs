import { Controller } from '@nestjs/common';
import { TurnInvitationService } from '../service/turn-invitation.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TURN_INVITATION_MESSAGE_PATTERNS } from '../constant/turn-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { TurnInvitationEntity } from '../entity/turn-invitation.entity';
import { CreateTurnInvitationDto } from '../dto/invitation/create-turn-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';

@Controller()
export class TurnInvitationController {
  constructor(
    private turnInvitationService: TurnInvitationService,
  ) {}

  @MessagePattern(TURN_INVITATION_MESSAGE_PATTERNS.CREATE)
  async createInvitation(
    @Payload() createDto: CreateTurnInvitationDto,
  ): Promise<IServiceResponse<TurnInvitationEntity>> {
    return await this.turnInvitationService.create(createDto);
  }

  @MessagePattern(TURN_INVITATION_MESSAGE_PATTERNS.FIND_BY_ID)
  async getInvitationById(
    @Payload() id: string,
  ): Promise<IServiceResponse<TurnInvitationEntity>> {
    return await this.turnInvitationService.findById(id);
  }

  @MessagePattern(TURN_INVITATION_MESSAGE_PATTERNS.FIND_BY_ACTIVE_CODE)
  async getInvitationByCode(
    @Payload() code: string,
  ): Promise<IServiceResponse<TurnInvitationEntity>> {
    return await this.turnInvitationService.findByActiveCode(code);
  }

  @MessagePattern(TURN_INVITATION_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<TurnInvitationEntity>,
  ): Promise<IServiceResponse<TurnInvitationEntity>> {
    return await this.turnInvitationService.update(id, updateDto);
  }

  @MessagePattern(TURN_INVITATION_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<TurnInvitationEntity>> {
    return await this.turnInvitationService.remove(id);
  }

  @MessagePattern(TURN_INVITATION_MESSAGE_PATTERNS.USE)
  async useInvitation(
    @Payload('code') code: string,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.turnInvitationService.use(code, user);
  }
}
