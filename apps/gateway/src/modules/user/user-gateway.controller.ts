import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { Auth, CurrentUser } from '@app/authentication';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
import { firstValueFrom } from 'rxjs';
import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import { ClientProxy } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from 'apps/user/src/constant/user-patterns.constant';
import { UpdateUserDto } from 'apps/user/src/dto/update-user.dto';

@ApiTags('User Gateway')
@Controller({
  path: '/users',
  version: '1',
})
export class UserGatewayController {
  constructor(
    @Inject(RabbitServiceName.USER) private userClient: ClientProxy,
  ) {}
  @Auth()
  @Get('/me')
  async getSelf(
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<UserEntity>> {
    return {
      state: true,
      data: user,
    };
  }

  @Post('/new')
  async createUser(
    @Body() createDto: CreateUserDto,
    // @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<UserEntity>> {
    const {
      state,
      data: newUser,
      message,
    } = await firstValueFrom(
      this.userClient.send<IServiceResponse<UserEntity>, CreateUserDto>(
        USER_MESSAGE_PATTERNS.CREATE,
        createDto,
      ),
    );
    return {
      state,
      data: newUser,
      message: message,
    };
  }

  @Get('/:id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<UserEntity>> {
    const { state, data: user } = await firstValueFrom(
      this.userClient.send<IServiceResponse<UserEntity>, string>(
        USER_MESSAGE_PATTERNS.FIND_BY_ID,
        id,
      ),
    );
    return {
      state,
      data: user,
    };
  }

  @Patch('/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUserDto,
    // @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<UserEntity>> {
    const {
      state,
      data: newUser,
      message,
    } = await firstValueFrom(
      this.userClient.send<
        IServiceResponse<UserEntity>,
        { updateDto: UpdateUserDto; id: string }
      >(USER_MESSAGE_PATTERNS.UPDATE, { updateDto: updateDto, id: id }),
    );
    return {
      state,
      data: newUser,
      message: message,
    };
  }
}
