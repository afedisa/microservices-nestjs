import { Controller } from '@nestjs/common';
import { ServiceInvitationService } from '../service/service-invitation.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SERVICE_INVITATION_MESSAGE_PATTERNS } from '../constant/service-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { ServiceInvitationEntity } from '../entity/service-invitation.entity';
import { CreateServiceInvitationDto } from '../dto/invitation/create-service-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';

@Controller()
export class ServiceInvitationController {
  constructor(
    private serviceInvitationService: ServiceInvitationService,
  ) {}

  @MessagePattern(SERVICE_INVITATION_MESSAGE_PATTERNS.CREATE)
  async createInvitation(
    @Payload() createDto: CreateServiceInvitationDto,
  ): Promise<IServiceResponse<ServiceInvitationEntity>> {
    return await this.serviceInvitationService.create(createDto);
  }

  @MessagePattern(SERVICE_INVITATION_MESSAGE_PATTERNS.FIND_BY_ID)
  async getInvitationById(
    @Payload() id: string,
  ): Promise<IServiceResponse<ServiceInvitationEntity>> {
    return await this.serviceInvitationService.findById(id);
  }

  @MessagePattern(SERVICE_INVITATION_MESSAGE_PATTERNS.FIND_BY_ACTIVE_CODE)
  async getInvitationByCode(
    @Payload() code: string,
  ): Promise<IServiceResponse<ServiceInvitationEntity>> {
    return await this.serviceInvitationService.findByActiveCode(code);
  }

  @MessagePattern(SERVICE_INVITATION_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<ServiceInvitationEntity>,
  ): Promise<IServiceResponse<ServiceInvitationEntity>> {
    return await this.serviceInvitationService.update(id, updateDto);
  }

  @MessagePattern(SERVICE_INVITATION_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<ServiceInvitationEntity>> {
    return await this.serviceInvitationService.remove(id);
  }

  @MessagePattern(SERVICE_INVITATION_MESSAGE_PATTERNS.USE)
  async useInvitation(
    @Payload('code') code: string,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.serviceInvitationService.use(code, user);
  }
}
