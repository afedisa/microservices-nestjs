import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SERVICE_MEMBER_MESSAGE_PATTERNS } from '../constant/service-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { ServiceMemberService } from '../service/service-member.service';
import { ServiceEntity } from '../entity/service.entity';
import { ServiceMemberEntity } from '../entity/service-member.entity';

@Controller()
export class ServiceMemberController {
  constructor(private serviceMemberService: ServiceMemberService) {}

  @MessagePattern(SERVICE_MEMBER_MESSAGE_PATTERNS.CREATE)
  async createMember(
    @Payload('service') service: ServiceEntity,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<ServiceMemberEntity>> {
    return await this.serviceMemberService.create(service, user);
  }

  @MessagePattern(SERVICE_MEMBER_MESSAGE_PATTERNS.FIND_ALL)
  async getMembers(
    @Payload() service: ServiceEntity,
  ): Promise<IServiceResponse<ServiceMemberEntity[]>> {
    return await this.serviceMemberService.findAll(service);
  }

  @MessagePattern(SERVICE_MEMBER_MESSAGE_PATTERNS.FIND_BY_USER)
  async getMemberByUser(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<ServiceMemberEntity>> {
    return await this.serviceMemberService.findByUser(user);
  }

  @MessagePattern(SERVICE_MEMBER_MESSAGE_PATTERNS.REMOVE)
  async removeMember(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<ServiceMemberEntity>> {
    return await this.serviceMemberService.remove(user);
  }

  @MessagePattern(SERVICE_MEMBER_MESSAGE_PATTERNS.is_UNEMPLOYED)
  async getUserIsUnemployed(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.serviceMemberService.isUnemployed(user);
  }
}
