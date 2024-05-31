import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TurnEntity } from '../entity/turn.entity';
import { Database } from '@app/database';
import { DeleteResult, Like, Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';
import { CreateTurnDto } from '../dto/turn/create-turn.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { FindTurnsDto } from '../dto/turn/find-turn.dto';
import { IPagination } from '@app/common';
import { TURN_MAX_COUNT_PER_USER } from '../constant/turn.constant';

@Injectable()
export class TurnService {
  constructor(
    @InjectRepository(TurnEntity, Database.PRIMARY)
    private turnRepository: Repository<TurnEntity>,
  ) {}

  async create(
    createDto: CreateTurnDto,
    user: UserEntity,
  ): Promise<IServiceResponse<TurnEntity>> {
    let result;
    const { state: canCreate } = await this.validateTurnCountLimitation(
      user.id,
    );
    if (canCreate) {
      const turn = this.turnRepository.create(createDto);
      turn.owner = user;
      result = await this.turnRepository.save(turn);
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
  }: FindTurnsDto): Promise<IServiceResponse<IPagination<TurnEntity>>> {
    limit = limit || 20;
    page = page || 1;
    const where = [
      name ? { name: Like(name) } : { name: 'IS NOT NULL' },
      enabled ? { enabled } : { enabled: true },
    ];
    const companies = await this.turnRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const turnCount = await this.turnRepository.count({ where });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: companies,
        total: Math.ceil(turnCount / limit),
      },
    };
  }

  async findById(id: string): Promise<IServiceResponse<TurnEntity>> {
    const turn = await this.turnRepository.findOneBy({ id });
    return {
      state: !!turn,
      data: turn,
    };
  }

  async update(
    id: string,
    updateDto: Partial<TurnEntity>,
  ): Promise<IServiceResponse<TurnEntity>> {
    let result;
    const { state: finded, data: turn } = await this.findById(id);
    if (finded) {
      Object.assign(turn, updateDto);
      result = await this.turnRepository.save(turn);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<DeleteResult>> {
    console.log('delete turn id', id);
    try {
      const result = await this.turnRepository.delete({ id });
      console.log('delete turn', result);
      return {
        state: !!result,
        data: result,
        message: !!result ? 'turn.deleted' : 'turn.notfound',
      };
    } catch (error) {
      console.log('error', error);
      return {
        state: false,
        data: error.detail,
        message: 'turn.notfound',
      };
    }
  }

  async validateTurnCountLimitation(
    userId: string,
  ): Promise<IServiceResponse<boolean>> {
    const ownedCompanies = await this.turnRepository.findBy({
      ownerId: userId,
    });
    const valid = ownedCompanies.length < TURN_MAX_COUNT_PER_USER;
    return {
      state: valid,
      data: valid,
    };
  }
}
