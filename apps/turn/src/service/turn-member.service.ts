import { Injectable } from '@nestjs/common';
import { TurnEntity } from '../entity/turn.entity';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TurnMemberEntity } from '../entity/turn-member.entity';
import { Database } from '@app/database';
import { Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';

@Injectable()
export class TurnMemberService {
  constructor(
    @InjectRepository(TurnMemberEntity, Database.PRIMARY)
    private turnMemberRepository: Repository<TurnMemberEntity>,
  ) {}

  async create(
    turn: TurnEntity,
    user: UserEntity,
  ): Promise<IServiceResponse<TurnMemberEntity>> {
    let result;
    const { state: isUnemployed } = await this.isUnemployed(user);
    if (isUnemployed) {
      const member = await this.turnMemberRepository.create({
        turn,
        user,
      });
      result = await this.turnMemberRepository.save(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll(
    turn: TurnEntity,
  ): Promise<IServiceResponse<TurnMemberEntity[]>> {
    const members = await this.turnMemberRepository.findBy({
      turn: { id: turn.id },
    });
    return {
      state: true,
      data: members,
    };
  }

  async findByUser(
    user: UserEntity,
  ): Promise<IServiceResponse<TurnMemberEntity>> {
    const member = await this.turnMemberRepository.findOneBy({
      user: { id: user.id },
    });
    return {
      state: !!member,
      data: member,
    };
  }

  async remove(
    user: UserEntity,
  ): Promise<IServiceResponse<TurnMemberEntity>> {
    let result;
    const { data: member } = await this.findByUser(user);
    if (member) {
      result = await this.turnMemberRepository.remove(member);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async isUnemployed(user: UserEntity): Promise<IServiceResponse<boolean>> {
    const member = await this.turnMemberRepository.findOneBy({
      user: { id: user.id },
    });
    const result = !!member == false;
    return {
      state: result,
      data: result,
    };
  }
}
