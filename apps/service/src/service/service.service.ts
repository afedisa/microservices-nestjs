import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceEntity } from '../entity/service.entity';
import { Database } from '@app/database';
import { Like, Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';
import { CreateServiceDto } from '../dto/service/create-service.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { FindCompaniesDto } from '../dto/service/find-service.dto';
import { IPagination } from '@app/common';
import { SERVICE_MAX_COUNT_PER_USER } from '../constant/service.constant';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity, Database.PRIMARY)
    private serviceRepository: Repository<ServiceEntity>,
  ) {}

  async create(
    createDto: CreateServiceDto,
    user: UserEntity,
  ): Promise<IServiceResponse<ServiceEntity>> {
    let result;
    const { state: canCreate } = await this.validateServiceCountLimitation(
      user.id,
    );
    if (canCreate) {
      const service = this.serviceRepository.create(createDto);
      service.owner = user;
      result = await this.serviceRepository.save(service);
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
  }: FindCompaniesDto): Promise<IServiceResponse<IPagination<ServiceEntity>>> {
    limit = limit || 20;
    page = page || 1;
    const where = [
      name ? { name: Like(name) } : { name: 'IS NOT NULL' },
      enabled ? { enabled } : { enabled: true },
    ];
    const companies = await this.serviceRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const serviceCount = await this.serviceRepository.count({ where });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: companies,
        total: Math.ceil(serviceCount / limit),
      },
    };
  }

  async findById(id: string): Promise<IServiceResponse<ServiceEntity>> {
    const service = await this.serviceRepository.findOneBy({ id });
    return {
      state: !!service,
      data: service,
    };
  }

  async update(
    id: string,
    updateDto: Partial<ServiceEntity>,
  ): Promise<IServiceResponse<ServiceEntity>> {
    let result;
    const { state: finded, data: service } = await this.findById(id);
    if (finded) {
      Object.assign(service, updateDto);
      result = await this.serviceRepository.save(service);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateServiceCountLimitation(
    userId: string,
  ): Promise<IServiceResponse<boolean>> {
    const ownedCompanies = await this.serviceRepository.findBy({
      ownerId: userId,
    });
    const valid = ownedCompanies.length < SERVICE_MAX_COUNT_PER_USER;
    return {
      state: valid,
      data: valid,
    };
  }
}
