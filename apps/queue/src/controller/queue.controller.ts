import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QUEUE_MESSAGE_PATTERNS } from '../constant/queue-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { CreateQueueDto } from '../dto/queue/create-queue.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { QueueEntity } from '../entity/queue.entity';
import { QueueService } from '../service/queue.service';
import { FindCompaniesDto } from '../dto/queue/find-queue.dto';
import { IPagination } from '@app/common/interface/pagination.interface';

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
    @Payload() findDto: FindCompaniesDto,
  ): Promise<IServiceResponse<IPagination<QueueEntity>>> {
    return await this.queueService.findAll(findDto);
  }

  @MessagePattern(QUEUE_MESSAGE_PATTERNS.FIND_BY_ID)
  async getQueueById(
    @Payload() id: string,
  ): Promise<IServiceResponse<QueueEntity>> {
    return await this.queueService.findById(id);
  }
}
