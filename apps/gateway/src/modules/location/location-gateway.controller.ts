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
import { LOCATION_MESSAGE_PATTERNS } from 'apps/location/src/constant/location-patterns.constant';
import { FindLocationsDto } from 'apps/location/src/dto/location/find-location.dto';
import { firstValueFrom } from 'rxjs';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IPagination } from '@app/common';
import { LocationEntity } from 'apps/location/src/entity/location.entity';
import { CreateLocationDto } from 'apps/location/src/dto/location/create-location.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { UpdateLocationDto } from 'apps/location/src/dto/location/update-location.dto';

@ApiTags('Location Gateway')
@Controller({
  path: '/locations',
  version: '1',
})
// @Auth()
export class LocationGatewayController {
  constructor(
    @Inject(RabbitServiceName.LOCATION) private locationClient: ClientProxy,
  ) {}

  @Get('/all')
  async getLocations(
    @Query() findDto: FindLocationsDto,
  ): Promise<IGatewayResponse<IPagination<LocationEntity>>> {
    const { state, data: locations } = await firstValueFrom(
      this.locationClient.send<
        IServiceResponse<IPagination<LocationEntity>>,
        FindLocationsDto
      >(LOCATION_MESSAGE_PATTERNS.FIND_ALL, findDto),
    );
    return {
      state,
      data: locations,
    };
  }

  @Get('/:id')
  async getLocationById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<LocationEntity>> {
    const { state, data: location } = await firstValueFrom(
      this.locationClient.send<IServiceResponse<LocationEntity>, string>(
        LOCATION_MESSAGE_PATTERNS.FIND_BY_ID,
        id,
      ),
    );
    return {
      state,
      data: location,
    };
  }

  @Post('/')
  async createLocation(
    @Body() createDto: CreateLocationDto,
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<LocationEntity>> {
    const { state, data: location } = await firstValueFrom(
      this.locationClient.send<
        IServiceResponse<LocationEntity>,
        { createDto: CreateLocationDto; user: UserEntity }
      >(LOCATION_MESSAGE_PATTERNS.CREATE, {
        createDto,
        user,
      }),
    );
    return {
      state,
      data: location,
    };
  }
  @Patch('/:id')
  async updateLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateLocationDto,
    // @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<LocationEntity>> {
    const {
      state,
      data: newLocation,
      message,
    } = await firstValueFrom(
      this.locationClient.send<
        IServiceResponse<LocationEntity>,
        { updateDto: UpdateLocationDto; id: string }
      >(LOCATION_MESSAGE_PATTERNS.UPDATE, { updateDto: updateDto, id: id }),
    );
    return {
      state,
      data: newLocation,
      message: message,
    };
  }

  @Delete('/:id')
  async deleteLocation(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<LocationEntity>> {
    console.log('deleteLocation id', id);
    const { state, data: location } = await firstValueFrom(
      this.locationClient.send<IServiceResponse<LocationEntity>, string>(
        LOCATION_MESSAGE_PATTERNS.REMOVE,
        id,
      ),
    );
    return {
      state,
      data: location,
    };
  }
}
