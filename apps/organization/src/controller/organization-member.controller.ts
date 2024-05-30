import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORGANIZATION_MEMBER_MESSAGE_PATTERNS } from '../constant/organization-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { OrganizationMemberService } from '../service/organization-member.service';
import { OrganizationEntity } from '../entity/organization.entity';
import { OrganizationMemberEntity } from '../entity/organization-member.entity';

@Controller()
export class OrganizationMemberController {
  constructor(private organizationMemberService: OrganizationMemberService) {}

  @MessagePattern(ORGANIZATION_MEMBER_MESSAGE_PATTERNS.CREATE)
  async createMember(
    @Payload('organization') organization: OrganizationEntity,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<OrganizationMemberEntity>> {
    return await this.organizationMemberService.create(organization, user);
  }

  @MessagePattern(ORGANIZATION_MEMBER_MESSAGE_PATTERNS.FIND_ALL)
  async getMembers(
    @Payload() organization: OrganizationEntity,
  ): Promise<IServiceResponse<OrganizationMemberEntity[]>> {
    return await this.organizationMemberService.findAll(organization);
  }

  @MessagePattern(ORGANIZATION_MEMBER_MESSAGE_PATTERNS.FIND_BY_USER)
  async getMemberByUser(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<OrganizationMemberEntity>> {
    return await this.organizationMemberService.findByUser(user);
  }

  @MessagePattern(ORGANIZATION_MEMBER_MESSAGE_PATTERNS.REMOVE)
  async removeMember(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<OrganizationMemberEntity>> {
    return await this.organizationMemberService.remove(user);
  }

  @MessagePattern(ORGANIZATION_MEMBER_MESSAGE_PATTERNS.is_UNEMPLOYED)
  async getUserIsUnemployed(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.organizationMemberService.isUnemployed(user);
  }
}
