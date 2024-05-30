import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DEVICE_MEMBER_MESSAGE_PATTERNS } from '../constant/device-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { DeviceMemberService } from '../service/device-member.service';
import { DeviceEntity } from '../entity/device.entity';
import { DeviceMemberEntity } from '../entity/device-member.entity';

@Controller()
export class DeviceMemberController {
  constructor(private deviceMemberService: DeviceMemberService) {}

  @MessagePattern(DEVICE_MEMBER_MESSAGE_PATTERNS.CREATE)
  async createMember(
    @Payload('device') device: DeviceEntity,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<DeviceMemberEntity>> {
    return await this.deviceMemberService.create(device, user);
  }

  @MessagePattern(DEVICE_MEMBER_MESSAGE_PATTERNS.FIND_ALL)
  async getMembers(
    @Payload() device: DeviceEntity,
  ): Promise<IServiceResponse<DeviceMemberEntity[]>> {
    return await this.deviceMemberService.findAll(device);
  }

  @MessagePattern(DEVICE_MEMBER_MESSAGE_PATTERNS.FIND_BY_USER)
  async getMemberByUser(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<DeviceMemberEntity>> {
    return await this.deviceMemberService.findByUser(user);
  }

  @MessagePattern(DEVICE_MEMBER_MESSAGE_PATTERNS.REMOVE)
  async removeMember(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<DeviceMemberEntity>> {
    return await this.deviceMemberService.remove(user);
  }

  @MessagePattern(DEVICE_MEMBER_MESSAGE_PATTERNS.is_UNEMPLOYED)
  async getUserIsUnemployed(
    @Payload() user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    return await this.deviceMemberService.isUnemployed(user);
  }
}
