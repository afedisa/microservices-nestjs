import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { Auth, CurrentUser } from '@app/authentication';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
import { firstValueFrom } from 'rxjs';
import { IServiceResponse, RabbitServiceName } from '@app/rabbit';
import { ClientProxy } from '@nestjs/microservices';
import { USER_MESSAGE_PATTERNS } from 'apps/user/src/constant/user-patterns.constant';

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
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<UserEntity>> {
    const { state, data: company } = await firstValueFrom(
      this.userClient.send<
        IServiceResponse<UserEntity>,
        { createDto: CreateUserDto; user: UserEntity }
      >(USER_MESSAGE_PATTERNS.CREATE, {
        createDto,
        user,
      }),
    );
    return {
      state,
      data: company,
    };
  }
}
