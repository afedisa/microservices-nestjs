import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInvitationEntity } from '../entity/device-invitation.entity';
import { Database } from '@app/database';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateDeviceInvitationDto } from '../dto/invitation/create-device-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { DeviceEntity } from '../entity/device.entity';
import { IServiceResponse } from '@app/rabbit';
import { DEVICE_MAX_INVITATION_COUNT } from '../constant/device.constant';
import { DeviceMemberService } from './device-member.service';
import { DeviceService } from './device.service';
import { IPagination } from '@app/common';
import { FindCompaniesInvitationsDto } from '../dto/invitation/find-device-invitation';

@Injectable()
export class DeviceInvitationService {
  constructor(
    @InjectRepository(DeviceInvitationEntity, Database.PRIMARY)
    private deviceInvitationRepository: Repository<DeviceInvitationEntity>,
    private deviceService: DeviceService,
    private deviceMemberService: DeviceMemberService,
  ) {}

  async create({
    device,
  }: CreateDeviceInvitationDto): Promise<
    IServiceResponse<DeviceInvitationEntity>
  > {
    let result;
    const { state: canCreate } = await this.validateMaxInviteCount(device);
    if (canCreate) {
      const invite = this.deviceInvitationRepository.create();
      invite.device = device;
      result = await this.deviceInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll({
    deviceId,
    limit,
    page,
  }: FindCompaniesInvitationsDto): Promise<
    IServiceResponse<IPagination<DeviceInvitationEntity>>
  > {
    const where = [deviceId ? { deviceId } : null];
    const invites = await this.deviceInvitationRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const invitesCount = await this.deviceInvitationRepository.count({
      where,
    });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: invites,
        total: Math.ceil(invitesCount / limit),
      },
    };
  }

  async findById(
    id: string,
  ): Promise<IServiceResponse<DeviceInvitationEntity>> {
    const invite = await this.deviceInvitationRepository.findOneBy({ id });
    return {
      state: !!invite,
      data: invite,
    };
  }

  async findByActiveCode(
    code: string,
  ): Promise<IServiceResponse<DeviceInvitationEntity>> {
    const invite = await this.deviceInvitationRepository.findOneBy({
      code,
      use: false,
      expire: MoreThanOrEqual(new Date()),
    });
    return {
      state: !!invite,
      data: invite,
    };
  }

  async use(
    code: string,
    user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    let result;
    const { state: finded, data: { id } = { id: null } } =
      await this.findByActiveCode(code);
    if (finded) {
      const { state: updated, data: invite } = await this.update(id, {
        use: true,
      });
      if (updated) {
        const { data: device } = await this.deviceService.findById(
          invite.deviceId,
        );
        const { state: isJoined, data: deviceMember } =
          await this.deviceMemberService.create(device, user);
        if (isJoined) {
          result = invite;
        }
      }
    }
    return {
      state: !!result,
      data: result,
      message: `device.invitation-${!!result ? 'success' : 'invalid'}`,
    };
  }

  async update(
    id: string,
    updateDto: Partial<DeviceInvitationEntity>,
  ): Promise<IServiceResponse<DeviceInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      Object.assign(invite, updateDto);
      result = await this.deviceInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<DeviceInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      result = await this.deviceInvitationRepository.remove(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateMaxInviteCount(
    device: DeviceEntity,
  ): Promise<IServiceResponse<boolean>> {
    const invites = await this.deviceInvitationRepository.findBy({
      device: { id: device.id },
    });
    const valid = invites.length < DEVICE_MAX_INVITATION_COUNT;
    return {
      state: valid,
      data: valid,
    };
  }
}
