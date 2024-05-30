import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LOCATION_MEMBER_MESSAGE_PATTERNS } from '../constant/location-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { LocationMemberService } from '../service/location-member.service';
import { LocationEntity } from '../entity/location.entity';
import { LocationMemberEntity } from '../entity/location-member.entity';

@Controller()
export class LocationMemberController {
  constructor(private locationMemberService: LocationMemberService) {}

  @MessagePattern(LOCATION_MEMBER_MESSAGE_PATTERNS.CREATE)
  async createMember(
    @Payload('location') location: LocationEntity,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<LocationMemberEntity>> {
    return await this.locationMemberService.create(location, user);
  }

  @MessagePattern(LOCATION_MEMBER_MESSAGE_PATTERNS.FIND_ALL)
  async getMembers(
    @Payload() location: LocationEntity,
  ): Promise<IServiceResponse<LocationMemberEntity[]>> {
    return await this.locationMemberService.findAll(location);
  }

  @MessagePattern(LOCATION_MEMBER_MESSAGE_PATTERNS.FIND_BY_USER)
  async getMemberByUser(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<LocationMemberEntity>> {
    return await this.locationMemberService.findByUser(user);
  }

  @MessagePattern(LOCATION_MEMBER_MESSAGE_PATTERNS.REMOVE)
  async removeMember(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<LocationMemberEntity>> {
    return await this.locationMemberService.remove(user);
  }

  @MessagePattern(LOCATION_MEMBER_MESSAGE_PATTERNS.is_UNEMPLOYED)
  async getUserIsUnemployed(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.locationMemberService.isUnemployed(user);
  }
}
