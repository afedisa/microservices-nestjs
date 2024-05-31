import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LOCATION_MESSAGE_PATTERNS } from '../constant/location-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { IPagination } from '@app/common/interface/pagination.interface';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { CreateLocationDto } from '../dto/location/create-location.dto';
import { FindCompaniesDto } from '../dto/location/find-location.dto';
import { LocationEntity } from '../entity/location.entity';
import { LocationService } from '../service/location.service';
import { DeleteResult } from 'typeorm';

@Controller()
export class LocationController {
  constructor(private locationService: LocationService) {}

  @MessagePattern(LOCATION_MESSAGE_PATTERNS.CREATE)
  async createLocation(
    @Payload('createDto') createDto: CreateLocationDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<LocationEntity>> {
    return await this.locationService.create(createDto, user);
  }

  @MessagePattern(LOCATION_MESSAGE_PATTERNS.FIND_ALL)
  async getCompanies(
    @Payload() findDto: FindCompaniesDto,
  ): Promise<IServiceResponse<IPagination<LocationEntity>>> {
    return await this.locationService.findAll(findDto);
  }

  @MessagePattern(LOCATION_MESSAGE_PATTERNS.FIND_BY_ID)
  async getLocationById(
    @Payload() id: string,
  ): Promise<IServiceResponse<LocationEntity>> {
    return await this.locationService.findById(id);
  }
  @MessagePattern(LOCATION_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<LocationEntity>,
  ): Promise<IServiceResponse<LocationEntity>> {
    return await this.locationService.update(id, updateDto);
  }

  @MessagePattern(LOCATION_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<DeleteResult>> {
    return await this.locationService.remove(id);
  }
}
