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
import { TURN_MESSAGE_PATTERNS } from 'apps/turn/src/constant/turn-patterns.constant';
import { FindTurnsDto } from 'apps/turn/src/dto/turn/find-turn.dto';
import { firstValueFrom } from 'rxjs';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IPagination } from '@app/common';
import { TurnEntity } from 'apps/turn/src/entity/turn.entity';
import { CreateTurnDto } from 'apps/turn/src/dto/turn/create-turn.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { UpdateTurnDto } from 'apps/turn/src/dto/turn/update-turn.dto';

@ApiTags('Turn Gateway')
@Controller({
  path: '/turns',
  version: '1',
})
// @Auth()
export class TurnGatewayController {
  constructor(
    @Inject(RabbitServiceName.TURN) private turnClient: ClientProxy,
  ) {}

  @Get('/all')
  async getTurns(
    @Query() findDto: FindTurnsDto,
  ): Promise<IGatewayResponse<IPagination<TurnEntity>>> {
    const { state, data: turns } = await firstValueFrom(
      this.turnClient.send<
        IServiceResponse<IPagination<TurnEntity>>,
        FindTurnsDto
      >(TURN_MESSAGE_PATTERNS.FIND_ALL, findDto),
    );
    return {
      state,
      data: turns,
    };
  }

  @Get('/:id')
  async getTurnById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<TurnEntity>> {
    const { state, data: turn } = await firstValueFrom(
      this.turnClient.send<IServiceResponse<TurnEntity>, string>(
        TURN_MESSAGE_PATTERNS.FIND_BY_ID,
        id,
      ),
    );
    return {
      state,
      data: turn,
    };
  }

  @Post('/')
  async createTurn(
    @Body() createDto: CreateTurnDto,
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<TurnEntity>> {
    const { state, data: turn } = await firstValueFrom(
      this.turnClient.send<
        IServiceResponse<TurnEntity>,
        { createDto: CreateTurnDto; user: UserEntity }
      >(TURN_MESSAGE_PATTERNS.CREATE, {
        createDto,
        user,
      }),
    );
    return {
      state,
      data: turn,
    };
  }
  @Patch('/:id')
  async updateTurn(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTurnDto,
    // @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<TurnEntity>> {
    const {
      state,
      data: newTurn,
      message,
    } = await firstValueFrom(
      this.turnClient.send<
        IServiceResponse<TurnEntity>,
        { updateDto: UpdateTurnDto; id: string }
      >(TURN_MESSAGE_PATTERNS.UPDATE, { updateDto: updateDto, id: id }),
    );
    return {
      state,
      data: newTurn,
      message: message,
    };
  }

  @Delete('/:id')
  async deleteLocation(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<TurnEntity>> {
    console.log('deleteTurn id', id);
    const { state, data: turn } = await firstValueFrom(
      this.turnClient.send<IServiceResponse<TurnEntity>, string>(
        TURN_MESSAGE_PATTERNS.REMOVE,
        id,
      ),
    );
    return {
      state,
      data: turn,
    };
  }
}
