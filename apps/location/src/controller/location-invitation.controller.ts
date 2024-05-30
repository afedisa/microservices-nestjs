import { Controller } from '@nestjs/common';
import { LocationInvitationService } from '../service/location-invitation.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LOCATION_INVITATION_MESSAGE_PATTERNS } from '../constant/location-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { LocationInvitationEntity } from '../entity/location-invitation.entity';
import { CreateLocationInvitationDto } from '../dto/invitation/create-location-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';

@Controller()
export class LocationInvitationController {
  constructor(
    private locationInvitationService: LocationInvitationService,
  ) {}

  @MessagePattern(LOCATION_INVITATION_MESSAGE_PATTERNS.CREATE)
  async createInvitation(
    @Payload() createDto: CreateLocationInvitationDto,
  ): Promise<IServiceResponse<LocationInvitationEntity>> {
    return await this.locationInvitationService.create(createDto);
  }

  @MessagePattern(LOCATION_INVITATION_MESSAGE_PATTERNS.FIND_BY_ID)
  async getInvitationById(
    @Payload() id: string,
  ): Promise<IServiceResponse<LocationInvitationEntity>> {
    return await this.locationInvitationService.findById(id);
  }

  @MessagePattern(LOCATION_INVITATION_MESSAGE_PATTERNS.FIND_BY_ACTIVE_CODE)
  async getInvitationByCode(
    @Payload() code: string,
  ): Promise<IServiceResponse<LocationInvitationEntity>> {
    return await this.locationInvitationService.findByActiveCode(code);
  }

  @MessagePattern(LOCATION_INVITATION_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<LocationInvitationEntity>,
  ): Promise<IServiceResponse<LocationInvitationEntity>> {
    return await this.locationInvitationService.update(id, updateDto);
  }

  @MessagePattern(LOCATION_INVITATION_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<LocationInvitationEntity>> {
    return await this.locationInvitationService.remove(id);
  }

  @MessagePattern(LOCATION_INVITATION_MESSAGE_PATTERNS.USE)
  async useInvitation(
    @Payload('code') code: string,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.locationInvitationService.use(code, user);
  }
}
