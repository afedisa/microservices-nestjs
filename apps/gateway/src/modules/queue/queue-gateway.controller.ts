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
import { QUEUE_MESSAGE_PATTERNS } from 'apps/queue/src/constant/queue-patterns.constant';
import { FindQueuesDto } from 'apps/queue/src/dto/queue/find-queue.dto';
import { firstValueFrom } from 'rxjs';
import { IGatewayResponse } from '../../common/interface/gateway.interface';
import { IPagination } from '@app/common';
import { QueueEntity } from 'apps/queue/src/entity/queue.entity';
import { CreateQueueDto } from 'apps/queue/src/dto/queue/create-queue.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { UpdateQueueDto } from 'apps/queue/src/dto/queue/update-queue.dto';

@ApiTags('Queue Gateway')
@Controller({
  path: '/queues',
  version: '1',
})
// @Auth()
export class QueueGatewayController {
  constructor(
    @Inject(RabbitServiceName.QUEUE) private queueClient: ClientProxy,
  ) {}

  @Get('/all')
  async getQueues(
    @Query() findDto: FindQueuesDto,
  ): Promise<IGatewayResponse<IPagination<QueueEntity>>> {
    const { state, data: queues } = await firstValueFrom(
      this.queueClient.send<
        IServiceResponse<IPagination<QueueEntity>>,
        FindQueuesDto
      >(QUEUE_MESSAGE_PATTERNS.FIND_ALL, findDto),
    );
    return {
      state,
      data: queues,
    };
  }

  @Get('/:id')
  async getQueueById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<QueueEntity>> {
    const { state, data: queue } = await firstValueFrom(
      this.queueClient.send<IServiceResponse<QueueEntity>, string>(
        QUEUE_MESSAGE_PATTERNS.FIND_BY_ID,
        id,
      ),
    );
    return {
      state,
      data: queue,
    };
  }

  @Post('/')
  async createQueue(
    @Body() createDto: CreateQueueDto,
    @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<QueueEntity>> {
    const { state, data: queue } = await firstValueFrom(
      this.queueClient.send<
        IServiceResponse<QueueEntity>,
        { createDto: CreateQueueDto; user: UserEntity }
      >(QUEUE_MESSAGE_PATTERNS.CREATE, {
        createDto,
        user,
      }),
    );
    return {
      state,
      data: queue,
    };
  }
  @Patch('/:id')
  async updateQueue(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateQueueDto,
    // @CurrentUser() user: UserEntity,
  ): Promise<IGatewayResponse<QueueEntity>> {
    const {
      state,
      data: newQueue,
      message,
    } = await firstValueFrom(
      this.queueClient.send<
        IServiceResponse<QueueEntity>,
        { updateDto: UpdateQueueDto; id: string }
      >(QUEUE_MESSAGE_PATTERNS.UPDATE, { updateDto: updateDto, id: id }),
    );
    return {
      state,
      data: newQueue,
      message: message,
    };
  }

  @Delete('/:id')
  async deleteQueue(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IGatewayResponse<QueueEntity>> {
    console.log('deleteQueue id', id);
    const { state, data: queue } = await firstValueFrom(
      this.queueClient.send<IServiceResponse<QueueEntity>, string>(
        QUEUE_MESSAGE_PATTERNS.REMOVE,
        id,
      ),
    );
    return {
      state,
      data: queue,
    };
  }
}
