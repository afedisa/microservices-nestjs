import { Controller } from '@nestjs/common';
import { OrganizationInvitationService } from '../service/organization-invitation.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORGANIZATION_INVITATION_MESSAGE_PATTERNS } from '../constant/organization-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { OrganizationInvitationEntity } from '../entity/organization-invitation.entity';
import { CreateOrganizationInvitationDto } from '../dto/invitation/create-organization-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';

@Controller()
export class OrganizationInvitationController {
  constructor(
    private organizationInvitationService: OrganizationInvitationService,
  ) {}

  @MessagePattern(ORGANIZATION_INVITATION_MESSAGE_PATTERNS.CREATE)
  async createInvitation(
    @Payload() createDto: CreateOrganizationInvitationDto,
  ): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    return await this.organizationInvitationService.create(createDto);
  }

  @MessagePattern(ORGANIZATION_INVITATION_MESSAGE_PATTERNS.FIND_BY_ID)
  async getInvitationById(
    @Payload() id: string,
  ): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    return await this.organizationInvitationService.findById(id);
  }

  @MessagePattern(ORGANIZATION_INVITATION_MESSAGE_PATTERNS.FIND_BY_ACTIVE_CODE)
  async getInvitationByCode(
    @Payload() code: string,
  ): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    return await this.organizationInvitationService.findByActiveCode(code);
  }

  @MessagePattern(ORGANIZATION_INVITATION_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<OrganizationInvitationEntity>,
  ): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    return await this.organizationInvitationService.update(id, updateDto);
  }

  @MessagePattern(ORGANIZATION_INVITATION_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    return await this.organizationInvitationService.remove(id);
  }

  @MessagePattern(ORGANIZATION_INVITATION_MESSAGE_PATTERNS.USE)
  async useInvitation(
    @Payload('code') code: string,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.organizationInvitationService.use(code, user);
  }
}
