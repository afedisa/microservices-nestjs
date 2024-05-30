import { Controller } from '@nestjs/common';
import { DeviceInvitationService } from '../service/device-invitation.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DEVICE_INVITATION_MESSAGE_PATTERNS } from '../constant/device-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { DeviceInvitationEntity } from '../entity/device-invitation.entity';
import { CreateDeviceInvitationDto } from '../dto/invitation/create-device-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';

@Controller()
export class DeviceInvitationController {
  constructor(
    private deviceInvitationService: DeviceInvitationService,
  ) {}

  @MessagePattern(DEVICE_INVITATION_MESSAGE_PATTERNS.CREATE)
  async createInvitation(
    @Payload() createDto: CreateDeviceInvitationDto,
  ): Promise<IServiceResponse<DeviceInvitationEntity>> {
    return await this.deviceInvitationService.create(createDto);
  }

  @MessagePattern(DEVICE_INVITATION_MESSAGE_PATTERNS.FIND_BY_ID)
  async getInvitationById(
    @Payload() id: string,
  ): Promise<IServiceResponse<DeviceInvitationEntity>> {
    return await this.deviceInvitationService.findById(id);
  }

  @MessagePattern(DEVICE_INVITATION_MESSAGE_PATTERNS.FIND_BY_ACTIVE_CODE)
  async getInvitationByCode(
    @Payload() code: string,
  ): Promise<IServiceResponse<DeviceInvitationEntity>> {
    return await this.deviceInvitationService.findByActiveCode(code);
  }

  @MessagePattern(DEVICE_INVITATION_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<DeviceInvitationEntity>,
  ): Promise<IServiceResponse<DeviceInvitationEntity>> {
    return await this.deviceInvitationService.update(id, updateDto);
  }

  @MessagePattern(DEVICE_INVITATION_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<DeviceInvitationEntity>> {
    return await this.deviceInvitationService.remove(id);
  }

  @MessagePattern(DEVICE_INVITATION_MESSAGE_PATTERNS.USE)
  async useInvitation(
    @Payload('code') code: string,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.deviceInvitationService.use(code, user);
  }
}
