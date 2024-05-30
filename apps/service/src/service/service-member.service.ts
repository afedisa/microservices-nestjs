import { Injectable } from '@nestjs/common';
import { ServiceEntity } from '../entity/service.entity';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceMemberEntity } from '../entity/service-member.entity';
import { Database } from '@app/database';
import { Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';

@Injectable()
export class ServiceMemberService {
  constructor(
    @InjectRepository(ServiceMemberEntity, Database.PRIMARY)
    private serviceMemberRepository: Repository<ServiceMemberEntity>,
  ) {}

  async create(
    service: ServiceEntity,
    user: UserEntity,
  ): Promise<IServiceResponse<ServiceMemberEntity>> {
    let result;
    const { state: isUnemployed } = await this.isUnemployed(user);
    if (isUnemployed) {
      const member = await this.serviceMemberRepository.create({
        service,
        user,
      });
      result = await this.serviceMemberRepository.save(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll(
    service: ServiceEntity,
  ): Promise<IServiceResponse<ServiceMemberEntity[]>> {
    const members = await this.serviceMemberRepository.findBy({
      service: { id: service.id },
    });
    return {
      state: true,
      data: members,
    };
  }

  async findByUser(
    user: UserEntity,
  ): Promise<IServiceResponse<ServiceMemberEntity>> {
    const member = await this.serviceMemberRepository.findOneBy({
      user: { id: user.id },
    });
    return {
      state: !!member,
      data: member,
    };
  }

  async remove(
    user: UserEntity,
  ): Promise<IServiceResponse<ServiceMemberEntity>> {
    let result;
    const { data: member } = await this.findByUser(user);
    if (member) {
      result = await this.serviceMemberRepository.remove(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async isUnemployed(user: UserEntity): Promise<IServiceResponse<boolean>> {
    const member = await this.serviceMemberRepository.findOneBy({
      user: { id: user.id },
    });
    const result = !!member == false;
    return {
      state: result,
      data: result,
    };
  }
}
