import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from '../entity/location.entity';
import { Database } from '@app/database';
import { DeleteResult, Like, Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';
import { CreateLocationDto } from '../dto/location/create-location.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { FindCompaniesDto } from '../dto/location/find-location.dto';
import { IPagination } from '@app/common';
import { LOCATION_MAX_COUNT_PER_USER } from '../constant/location.constant';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity, Database.PRIMARY)
    private locationRepository: Repository<LocationEntity>,
  ) {}

  async create(
    createDto: CreateLocationDto,
    user: UserEntity,
  ): Promise<IServiceResponse<LocationEntity>> {
    let result;
    const { state: canCreate } = await this.validateLocationCountLimitation(
      user.id,
    );
    if (canCreate) {
      const location = this.locationRepository.create(createDto);
      location.owner = user;
      result = await this.locationRepository.save(location);
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
  }: FindCompaniesDto): Promise<IServiceResponse<IPagination<LocationEntity>>> {
    limit = limit || 20;
    page = page || 1;
    const where = [
      name ? { name: Like(name) } : { name: 'IS NOT NULL' },
      enabled ? { enabled } : { enabled: true },
    ];
    const companies = await this.locationRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const locationCount = await this.locationRepository.count({ where });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: companies,
        total: Math.ceil(locationCount / limit),
      },
    };
  }

  async findById(id: string): Promise<IServiceResponse<LocationEntity>> {
    const location = await this.locationRepository.findOneBy({ id });
    return {
      state: !!location,
      data: location,
    };
  }

  async update(
    id: string,
    updateDto: Partial<LocationEntity>,
  ): Promise<IServiceResponse<LocationEntity>> {
    let result;
    const { state: finded, data: location } = await this.findById(id);
    if (finded) {
      Object.assign(location, updateDto);
      result = await this.locationRepository.save(location);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<DeleteResult>> {
    console.log('delete location id', id);
    try {
      const result = await this.locationRepository.delete({ id });
      console.log('delete location', result);
      return {
        state: !!result,
        data: result,
        message: !!result ? 'location.deleted' : 'location.notfound',
      };
    } catch (error) {
      console.log('error', error);
      return {
        state: false,
        data: error.detail,
        message: 'location.notfound',
      };
    }
  }
  async validateLocationCountLimitation(
    userId: string,
  ): Promise<IServiceResponse<boolean>> {
    const ownedCompanies = await this.locationRepository.findBy({
      ownerId: userId,
    });
    const valid = ownedCompanies.length < LOCATION_MAX_COUNT_PER_USER;
    return {
      state: valid,
      data: valid,
    };
  }
}
