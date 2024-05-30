import { Injectable } from '@nestjs/common';
import { DeviceEntity } from '../entity/device.entity';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceMemberEntity } from '../entity/device-member.entity';
import { Database } from '@app/database';
import { Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';

@Injectable()
export class DeviceMemberService {
  constructor(
    @InjectRepository(DeviceMemberEntity, Database.PRIMARY)
    private deviceMemberRepository: Repository<DeviceMemberEntity>,
  ) {}

  async create(
    device: DeviceEntity,
    user: UserEntity,
  ): Promise<IServiceResponse<DeviceMemberEntity>> {
    let result;
    const { state: isUnemployed } = await this.isUnemployed(user);
    if (isUnemployed) {
      const member = await this.deviceMemberRepository.create({
        device,
        user,
      });
      result = await this.deviceMemberRepository.save(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll(
    device: DeviceEntity,
  ): Promise<IServiceResponse<DeviceMemberEntity[]>> {
    const members = await this.deviceMemberRepository.findBy({
      device: { id: device.id },
    });
    return {
      state: true,
      data: members,
    };
  }

  async findByUser(
    user: UserEntity,
  ): Promise<IServiceResponse<DeviceMemberEntity>> {
    const member = await this.deviceMemberRepository.findOneBy({
      user: { id: user.id },
    });
    return {
      state: !!member,
      data: member,
    };
  }

  async remove(
    user: UserEntity,
  ): Promise<IServiceResponse<DeviceMemberEntity>> {
    let result;
    const { data: member } = await this.findByUser(user);
    if (member) {
      result = await this.deviceMemberRepository.remove(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async isUnemployed(user: UserEntity): Promise<IServiceResponse<boolean>> {
    const member = await this.deviceMemberRepository.findOneBy({
      user: { id: user.id },
    });
    const result = !!member == false;
    return {
      state: result,
      data: result,
    };
  }
}
