import { Injectable } from '@nestjs/common';
import { QueueEntity } from '../entity/queue.entity';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueMemberEntity } from '../entity/queue-member.entity';
import { Database } from '@app/database';
import { Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';

@Injectable()
export class QueueMemberService {
  constructor(
    @InjectRepository(QueueMemberEntity, Database.PRIMARY)
    private queueMemberRepository: Repository<QueueMemberEntity>,
  ) {}

  async create(
    queue: QueueEntity,
    user: UserEntity,
  ): Promise<IServiceResponse<QueueMemberEntity>> {
    let result;
    const { state: isUnemployed } = await this.isUnemployed(user);
    if (isUnemployed) {
      const member = await this.queueMemberRepository.create({
        queue,
        user,
      });
      result = await this.queueMemberRepository.save(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll(
    queue: QueueEntity,
  ): Promise<IServiceResponse<QueueMemberEntity[]>> {
    const members = await this.queueMemberRepository.findBy({
      queue: { id: queue.id },
    });
    return {
      state: true,
      data: members,
    };
  }

  async findByUser(
    user: UserEntity,
  ): Promise<IServiceResponse<QueueMemberEntity>> {
    const member = await this.queueMemberRepository.findOneBy({
      user: { id: user.id },
    });
    return {
      state: !!member,
      data: member,
    };
  }

  async remove(
    user: UserEntity,
  ): Promise<IServiceResponse<QueueMemberEntity>> {
    let result;
    const { data: member } = await this.findByUser(user);
    if (member) {
      result = await this.queueMemberRepository.remove(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async isUnemployed(user: UserEntity): Promise<IServiceResponse<boolean>> {
    const member = await this.queueMemberRepository.findOneBy({
      user: { id: user.id },
    });
    const result = !!member == false;
    return {
      state: result,
      data: result,
    };
  }
}
