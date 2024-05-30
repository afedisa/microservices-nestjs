import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LOCATION_MESSAGE_PATTERNS } from '../constant/location-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { CreateLocationDto } from '../dto/location/create-location.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { LocationEntity } from '../entity/location.entity';
import { LocationService } from '../service/location.service';
import { FindCompaniesDto } from '../dto/location/find-location.dto';
import { IPagination } from '@app/common/interface/pagination.interface';

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
}
