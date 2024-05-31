import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { Database } from '@app/database';
import { DeleteResult, Like, Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';
import { CreateDeviceDto } from '../dto/device/create-device.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { FindCompaniesDto } from '../dto/device/find-device.dto';
import { IPagination } from '@app/common';
import { DEVICE_MAX_COUNT_PER_USER } from '../constant/device.constant';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity, Database.PRIMARY)
    private deviceRepository: Repository<DeviceEntity>,
  ) {}

  async create(
    createDto: CreateDeviceDto,
    user: UserEntity,
  ): Promise<IServiceResponse<DeviceEntity>> {
    let result;
    const { state: canCreate } = await this.validateDeviceCountLimitation(
      user.id,
    );
    if (canCreate) {
      const device = this.deviceRepository.create(createDto);
      device.owner = user;
      result = await this.deviceRepository.save(device);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll({
    limit,
    page,
    name,
    enabled,
  }: FindCompaniesDto): Promise<IServiceResponse<IPagination<DeviceEntity>>> {
    limit = limit || 20;
    page = page || 1;
    const where = [
      name ? { name: Like(name) } : { name: 'IS NOT NULL' },
      enabled ? { enabled } : { enabled: true },
    ];
    const companies = await this.deviceRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const deviceCount = await this.deviceRepository.count({ where });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: companies,
        total: Math.ceil(deviceCount / limit),
      },
    };
  }

  async findById(id: string): Promise<IServiceResponse<DeviceEntity>> {
    const device = await this.deviceRepository.findOneBy({ id });
    return {
      state: !!device,
      data: device,
    };
  }

  async update(
    id: string,
    updateDto: Partial<DeviceEntity>,
  ): Promise<IServiceResponse<DeviceEntity>> {
    let result;
    const { state: finded, data: device } = await this.findById(id);
    if (finded) {
      Object.assign(device, updateDto);
      result = await this.deviceRepository.save(device);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<DeleteResult>> {
    console.log('delete device id', id);
    try {
      const result = await this.deviceRepository.delete({ id });
      console.log('delete device', result);
      return {
        state: !!result,
        data: result,
        message: !!result ? 'device.deleted' : 'device.notfound',
      };
    } catch (error) {
      console.log('error', error);
      return {
        state: false,
        data: error.detail,
        message: 'device.notfound',
      };
    }
  }

  async validateDeviceCountLimitation(
    userId: string,
  ): Promise<IServiceResponse<boolean>> {
    const ownedCompanies = await this.deviceRepository.findBy({
      ownerId: userId,
    });
    const valid = ownedCompanies.length < DEVICE_MAX_COUNT_PER_USER;
    return {
      state: valid,
      data: valid,
    };
  }
}
