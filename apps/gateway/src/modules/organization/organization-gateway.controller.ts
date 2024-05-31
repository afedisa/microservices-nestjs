import { Auth, CurrentUser } from '@app/authentication';
import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { ORGANIZATION_MESSAGE_PATTERNS } from 'apps/organization/src/constant/organization-patterns.constant';
import { FindCompaniesDto } from 'apps/organization/src/dto/organization/find-organization.dto';
import { firstValueFrom } from 'rxjs';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IPagination } from '@app/common';
import { OrganizationEntity } from 'apps/organization/src/entity/organization.entity';
import { CreateOrganizationDto } from 'apps/organization/src/dto/organization/create-organization.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { UpdateOrganizationDto } from 'apps/organization/src/dto/organization/update-organization.dto';

@ApiTags('Organization Gateway')
@Controller({
  path: '/organizations',
  version: '1',
})
// @Auth()
export class OrganizationGatewayController {
  constructor(
    @Inject(RabbitServiceName.ORGANIZATION)
    private organizationClient: ClientProxy,
  ) {}

  @Get('/all')
  async getCompanies(
    @Query() findDto: FindCompaniesDto,
  ): Promise<IGatewayResponse<IPagination<OrganizationEntity>>> {
    const { state, data: companies } = await firstValueFrom(
      this.organizationClient.send<
        IServiceResponse<IPagination<OrganizationEntity>>,
        FindCompaniesDto
      >(ORGANIZATION_MESSAGE_PATTERNS.FIND_ALL, findDto),
    );
    return {
      state,
      data: companies,
    };
  }

  @Get('/:id')
  async getOrganizationById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<OrganizationEntity>> {
    const { state, data: organization } = await firstValueFrom(
      this.organizationClient.send<
        IServiceResponse<OrganizationEntity>,
        string
      >(ORGANIZATION_MESSAGE_PATTERNS.FIND_BY_ID, id),
    );
    return {
      state,
      data: organization,
    };
  }

  @Post('/')
  async createOrganization(
    @Body() createDto: CreateOrganizationDto,
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<OrganizationEntity>> {
    const { state, data: organization } = await firstValueFrom(
      this.organizationClient.send<
        IServiceResponse<OrganizationEntity>,
        { createDto: CreateOrganizationDto; user: UserEntity }
      >(ORGANIZATION_MESSAGE_PATTERNS.CREATE, {
        createDto,
        user,
      }),
    );
    return {
      state,
      data: organization,
    };
  }
  @Patch('/:id')
  async updateService(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateOrganizationDto,
    // @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<OrganizationEntity>> {
    const {
      state,
      data: newOrganization,
      message,
    } = await firstValueFrom(
      this.organizationClient.send<
        IServiceResponse<OrganizationEntity>,
        { updateDto: UpdateOrganizationDto; id: string }
      >(ORGANIZATION_MESSAGE_PATTERNS.UPDATE, { updateDto: updateDto, id: id }),
    );
    return {
      state,
      data: newOrganization,
      message: message,
    };
  }

  @Delete('/:id')
  async deleteService(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<OrganizationEntity>> {
    console.log('deleteQueue id', id);
    const { state, data: service } = await firstValueFrom(
      this.organizationClient.send<
        IServiceResponse<OrganizationEntity>,
        string
      >(ORGANIZATION_MESSAGE_PATTERNS.REMOVE, id),
    );
    return {
      state,
      data: service,
    };
  }
}
