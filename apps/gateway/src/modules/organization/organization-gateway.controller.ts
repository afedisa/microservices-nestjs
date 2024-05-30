import { Auth, CurrentUser } from '@app/authentication';
import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
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

@ApiTags('Organization Gateway')
@Controller({
  path: '/companies',
  version: '1',
})
// @Auth()
export class OrganizationGatewayController {
  constructor(
    @Inject(RabbitServiceName.ORGANIZATION) private organizationClient: ClientProxy,
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

  @Get('/')
  async getOrganizationById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<OrganizationEntity>> {
    const { state, data: organization } = await firstValueFrom(
      this.organizationClient.send<IServiceResponse<OrganizationEntity>, string>(
        ORGANIZATION_MESSAGE_PATTERNS.FIND_BY_ID,
        id,
      ),
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
}
