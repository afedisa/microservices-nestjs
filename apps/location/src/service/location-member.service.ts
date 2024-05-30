import { Injectable } from '@nestjs/common';
import { LocationEntity } from '../entity/location.entity';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationMemberEntity } from '../entity/location-member.entity';
import { Database } from '@app/database';
import { Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';

@Injectable()
export class LocationMemberService {
  constructor(
    @InjectRepository(LocationMemberEntity, Database.PRIMARY)
    private locationMemberRepository: Repository<LocationMemberEntity>,
  ) {}

  async create(
    location: LocationEntity,
    user: UserEntity,
  ): Promise<IServiceResponse<LocationMemberEntity>> {
    let result;
    const { state: isUnemployed } = await this.isUnemployed(user);
    if (isUnemployed) {
      const member = await this.locationMemberRepository.create({
        location,
        user,
      });
      result = await this.locationMemberRepository.save(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll(
    location: LocationEntity,
  ): Promise<IServiceResponse<LocationMemberEntity[]>> {
    const members = await this.locationMemberRepository.findBy({
      location: { id: location.id },
    });
    return {
      state: true,
      data: members,
    };
  }

  async findByUser(
    user: UserEntity,
  ): Promise<IServiceResponse<LocationMemberEntity>> {
    const member = await this.locationMemberRepository.findOneBy({
      user: { id: user.id },
    });
    return {
      state: !!member,
      data: member,
    };
  }

  async remove(
    user: UserEntity,
  ): Promise<IServiceResponse<LocationMemberEntity>> {
    let result;
    const { data: member } = await this.findByUser(user);
    if (member) {
      result = await this.locationMemberRepository.remove(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async isUnemployed(user: UserEntity): Promise<IServiceResponse<boolean>> {
    const member = await this.locationMemberRepository.findOneBy({
      user: { id: user.id },
    });
    const result = !!member == false;
    return {
      state: result,
      data: result,
    };
  }
}
