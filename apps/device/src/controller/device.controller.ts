import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DEVICE_MESSAGE_PATTERNS } from '../constant/device-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { IPagination } from '@app/common/interface/pagination.interface';
import { CreateDeviceDto } from '../dto/device/create-device.dto';
import { FindCompaniesDto } from '../dto/device/find-device.dto';
import { DeviceEntity } from '../entity/device.entity';
import { DeviceService } from '../service/device.service';
import { DeleteResult } from 'typeorm';

@Controller()
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @MessagePattern(DEVICE_MESSAGE_PATTERNS.CREATE)
  async createDevice(
    @Payload('createDto') createDto: CreateDeviceDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<DeviceEntity>> {
    return await this.deviceService.create(createDto, user);
  }

  @MessagePattern(DEVICE_MESSAGE_PATTERNS.FIND_ALL)
  async getCompanies(
    @Payload() findDto: FindCompaniesDto,
  ): Promise<IServiceResponse<IPagination<DeviceEntity>>> {
    return await this.deviceService.findAll(findDto);
  }

  @MessagePattern(DEVICE_MESSAGE_PATTERNS.FIND_BY_ID)
  async getDeviceById(
    @Payload() id: string,
  ): Promise<IServiceResponse<DeviceEntity>> {
    return await this.deviceService.findById(id);
  }
  @MessagePattern(DEVICE_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<DeviceEntity>,
  ): Promise<IServiceResponse<DeviceEntity>> {
    return await this.deviceService.update(id, updateDto);
  }

  @MessagePattern(DEVICE_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<DeleteResult>> {
    return await this.deviceService.remove(id);
  }
}
