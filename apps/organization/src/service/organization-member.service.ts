import { Injectable } from '@nestjs/common';
import { OrganizationEntity } from '../entity/organization.entity';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMemberEntity } from '../entity/organization-member.entity';
import { Database } from '@app/database';
import { Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';

@Injectable()
export class OrganizationMemberService {
  constructor(
    @InjectRepository(OrganizationMemberEntity, Database.PRIMARY)
    private organizationMemberRepository: Repository<OrganizationMemberEntity>,
  ) {}

  async create(
    organization: OrganizationEntity,
    user: UserEntity,
  ): Promise<IServiceResponse<OrganizationMemberEntity>> {
    let result;
    const { state: isUnemployed } = await this.isUnemployed(user);
    if (isUnemployed) {
      const member = await this.organizationMemberRepository.create({
        organization,
        user,
      });
      result = await this.organizationMemberRepository.save(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll(
    organization: OrganizationEntity,
  ): Promise<IServiceResponse<OrganizationMemberEntity[]>> {
    const members = await this.organizationMemberRepository.findBy({
      organization: { id: organization.id },
    });
    return {
      state: true,
      data: members,
    };
  }

  async findByUser(
    user: UserEntity,
  ): Promise<IServiceResponse<OrganizationMemberEntity>> {
    const member = await this.organizationMemberRepository.findOneBy({
      user: { id: user.id },
    });
    return {
      state: !!member,
      data: member,
    };
  }

  async remove(
    user: UserEntity,
  ): Promise<IServiceResponse<OrganizationMemberEntity>> {
    let result;
    const { data: member } = await this.findByUser(user);
    if (member) {
      result = await this.organizationMemberRepository.remove(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async isUnemployed(user: UserEntity): Promise<IServiceResponse<boolean>> {
    const member = await this.organizationMemberRepository.findOneBy({
      user: { id: user.id },
    });
    const result = !!member == false;
    return {
      state: result,
      data: result,
    };
  }
}
