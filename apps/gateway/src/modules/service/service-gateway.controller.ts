import { CurrentUser } from '@app/authentication';
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
import { SERVICE_MESSAGE_PATTERNS } from 'apps/service/src/constant/service-patterns.constant';
import { FindServicesDto } from 'apps/service/src/dto/service/find-service.dto';
import { firstValueFrom } from 'rxjs';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IPagination } from '@app/common';
import { ServiceEntity } from 'apps/service/src/entity/service.entity';
import { CreateServiceDto } from 'apps/service/src/dto/service/create-service.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { UpdateServiceDto } from 'apps/service/src/dto/service/update-service.dto';

@ApiTags('Service Gateway')
@Controller({
  path: '/services',
  version: '1',
})
// @Auth()
export class ServiceGatewayController {
  constructor(
    @Inject(RabbitServiceName.SERVICE) private serviceClient: ClientProxy,
  ) {}

  @Get('/all')
  async getServices(
    @Query() findDto: FindServicesDto,
  ): Promise<IGatewayResponse<IPagination<ServiceEntity>>> {
    const { state, data: services } = await firstValueFrom(
      this.serviceClient.send<
        IServiceResponse<IPagination<ServiceEntity>>,
        FindServicesDto
      >(SERVICE_MESSAGE_PATTERNS.FIND_ALL, findDto),
    );
    return {
      state,
      data: services,
    };
  }

  @Get('/:id')
  async getServiceById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<ServiceEntity>> {
    const { state, data: service } = await firstValueFrom(
      this.serviceClient.send<IServiceResponse<ServiceEntity>, string>(
        SERVICE_MESSAGE_PATTERNS.FIND_BY_ID,
        id,
      ),
    );
    return {
      state,
      data: service,
    };
  }

  @Post('/')
  async createService(
    @Body() createDto: CreateServiceDto,
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<ServiceEntity>> {
    const { state, data: service } = await firstValueFrom(
      this.serviceClient.send<
        IServiceResponse<ServiceEntity>,
        { createDto: CreateServiceDto; user: UserEntity }
      >(SERVICE_MESSAGE_PATTERNS.CREATE, {
        createDto,
        user,
      }),
    );
    return {
      state,
      data: service,
    };
  }
  @Patch('/:id')
  async updateService(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateServiceDto,
    // @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<ServiceEntity>> {
    const {
      state,
      data: newService,
      message,
    } = await firstValueFrom(
      this.serviceClient.send<
        IServiceResponse<ServiceEntity>,
        { updateDto: UpdateServiceDto; id: string }
      >(SERVICE_MESSAGE_PATTERNS.UPDATE, { updateDto: updateDto, id: id }),
    );
    return {
      state,
      data: newService,
      message: message,
    };
  }

  @Delete('/:id')
  async deleteService(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<ServiceEntity>> {
    console.log('deleteQueue id', id);
    const { state, data: service } = await firstValueFrom(
      this.serviceClient.send<IServiceResponse<ServiceEntity>, string>(
        SERVICE_MESSAGE_PATTERNS.REMOVE,
        id,
      ),
    );
    return {
      state,
      data: service,
    };
  }
}
