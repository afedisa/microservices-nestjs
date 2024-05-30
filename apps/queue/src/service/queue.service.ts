import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueEntity } from '../entity/queue.entity';
import { Database } from '@app/database';
import { Like, Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';
import { CreateQueueDto } from '../dto/queue/create-queue.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { FindCompaniesDto } from '../dto/queue/find-queue.dto';
import { IPagination } from '@app/common';
import { QUEUE_MAX_COUNT_PER_USER } from '../constant/queue.constant';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntity, Database.PRIMARY)
    private queueRepository: Repository<QueueEntity>,
  ) {}

  async create(
    createDto: CreateQueueDto,
    user: UserEntity,
  ): Promise<IServiceResponse<QueueEntity>> {
    let result;
    const { state: canCreate } = await this.validateQueueCountLimitation(
      user.id,
    );
    if (canCreate) {
      const queue = this.queueRepository.create(createDto);
      queue.owner = user;
      result = await this.queueRepository.save(queue);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll({
    limit,
    page,
    name,
    enabled,
  }: FindCompaniesDto): Promise<IServiceResponse<IPagination<QueueEntity>>> {
    limit = limit || 20;
    page = page || 1;
    const where = [
      name ? { name: Like(name) } : { name: 'IS NOT NULL' },
      enabled ? { enabled } : { enabled: true },
    ];
    const companies = await this.queueRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const queueCount = await this.queueRepository.count({ where });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: companies,
        total: Math.ceil(queueCount / limit),
      },
    };
  }

  async findById(id: string): Promise<IServiceResponse<QueueEntity>> {
    const queue = await this.queueRepository.findOneBy({ id });
    return {
      state: !!queue,
      data: queue,
    };
  }

  async update(
    id: string,
    updateDto: Partial<QueueEntity>,
  ): Promise<IServiceResponse<QueueEntity>> {
    let result;
    const { state: finded, data: queue } = await this.findById(id);
    if (finded) {
      Object.assign(queue, updateDto);
      result = await this.queueRepository.save(queue);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateQueueCountLimitation(
    userId: string,
  ): Promise<IServiceResponse<boolean>> {
    const ownedCompanies = await this.queueRepository.findBy({
      ownerId: userId,
    });
    const valid = ownedCompanies.length < QUEUE_MAX_COUNT_PER_USER;
    return {
      state: valid,
      data: valid,
    };
  }
}
