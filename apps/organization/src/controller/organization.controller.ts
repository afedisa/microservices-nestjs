import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORGANIZATION_MESSAGE_PATTERNS } from '../constant/organization-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { CreateOrganizationDto } from '../dto/organization/create-organization.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { OrganizationEntity } from '../entity/organization.entity';
import { OrganizationService } from '../service/organization.service';
import { FindCompaniesDto } from '../dto/organization/find-organization.dto';
import { IPagination } from '@app/common/interface/pagination.interface';

@Controller()
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @MessagePattern(ORGANIZATION_MESSAGE_PATTERNS.CREATE)
  async createOrganization(
    @Payload('createDto') createDto: CreateOrganizationDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<OrganizationEntity>> {
    return await this.organizationService.create(createDto, user);
  }

  @MessagePattern(ORGANIZATION_MESSAGE_PATTERNS.FIND_ALL)
  async getCompanies(
    @Payload() findDto: FindCompaniesDto,
  ): Promise<IServiceResponse<IPagination<OrganizationEntity>>> {
    return await this.organizationService.findAll(findDto);
  }

  @MessagePattern(ORGANIZATION_MESSAGE_PATTERNS.FIND_BY_ID)
  async getOrganizationById(
    @Payload() id: string,
  ): Promise<IServiceResponse<OrganizationEntity>> {
    return await this.organizationService.findById(id);
  }
}
