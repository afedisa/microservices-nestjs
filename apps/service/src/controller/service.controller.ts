import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SERVICE_MESSAGE_PATTERNS } from '../constant/service-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { CreateServiceDto } from '../dto/service/create-service.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { ServiceEntity } from '../entity/service.entity';
import { ServiceService } from '../service/service.service';
import { FindCompaniesDto } from '../dto/service/find-service.dto';
import { IPagination } from '@app/common/interface/pagination.interface';

@Controller()
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @MessagePattern(SERVICE_MESSAGE_PATTERNS.CREATE)
  async createService(
    @Payload('createDto') createDto: CreateServiceDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<ServiceEntity>> {
    return await this.serviceService.create(createDto, user);
  }

  @MessagePattern(SERVICE_MESSAGE_PATTERNS.FIND_ALL)
  async getCompanies(
    @Payload() findDto: FindCompaniesDto,
  ): Promise<IServiceResponse<IPagination<ServiceEntity>>> {
    return await this.serviceService.findAll(findDto);
  }

  @MessagePattern(SERVICE_MESSAGE_PATTERNS.FIND_BY_ID)
  async getServiceById(
    @Payload() id: string,
  ): Promise<IServiceResponse<ServiceEntity>> {
    return await this.serviceService.findById(id);
  }
}
