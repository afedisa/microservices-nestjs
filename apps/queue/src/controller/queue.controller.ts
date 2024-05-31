import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QUEUE_MESSAGE_PATTERNS } from '../constant/queue-patterns.constant';
import { IServiceResponse } from '@app/rabbit';

import { IPagination } from '@app/common/interface/pagination.interface';
import { DeleteResult } from 'typeorm';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { CreateQueueDto } from '../dto/queue/create-queue.dto';
import { FindQueueDto } from '../dto/queue/find-queue.dto';
import { QueueEntity } from '../entity/queue.entity';
import { QueueService } from '../service/queue.service';

@Controller()
export class QueueController {
  constructor(private queueService: QueueService) {}

  @MessagePattern(QUEUE_MESSAGE_PATTERNS.CREATE)
  async createQueue(
    @Payload('createDto') createDto: CreateQueueDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<QueueEntity>> {
    return await this.queueService.create(createDto, user);
  }

  @MessagePattern(QUEUE_MESSAGE_PATTERNS.FIND_ALL)
  async getCompanies(
    @Payload() findDto: FindQueueDto,
  ): Promise<IServiceResponse<IPagination<QueueEntity>>> {
    return await this.queueService.findAll(findDto);
  }

  @MessagePattern(QUEUE_MESSAGE_PATTERNS.FIND_BY_ID)
  async getQueueById(
    @Payload() id: string,
  ): Promise<IServiceResponse<QueueEntity>> {
    return await this.queueService.findById(id);
  }
  @MessagePattern(QUEUE_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<QueueEntity>,
  ): Promise<IServiceResponse<QueueEntity>> {
    return await this.queueService.update(id, updateDto);
  }

  @MessagePattern(QUEUE_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<DeleteResult>> {
    return await this.queueService.remove(id);
  }
}
