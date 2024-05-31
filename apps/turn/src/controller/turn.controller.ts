import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TURN_MESSAGE_PATTERNS } from '../constant/turn-patterns.constant';
import { IServiceResponse } from '@app/rabbit';
import { CreateTurnDto } from '../dto/turn/create-turn.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { TurnEntity } from '../entity/turn.entity';
import { TurnService } from '../service/turn.service';
import { FindTurnsDto } from '../dto/turn/find-turn.dto';
import { IPagination } from '@app/common/interface/pagination.interface';
import { DeleteResult } from 'typeorm';

@Controller()
export class TurnController {
  constructor(private turnService: TurnService) {}

  @MessagePattern(TURN_MESSAGE_PATTERNS.CREATE)
  async createTurn(
    @Payload('createDto') createDto: CreateTurnDto,
    @Payload('user') user: UserEntity,
  ): Promise<IServiceResponse<TurnEntity>> {
    return await this.turnService.create(createDto, user);
  }

  @MessagePattern(TURN_MESSAGE_PATTERNS.FIND_ALL)
  async getCompanies(
    @Payload() findDto: FindTurnsDto,
  ): Promise<IServiceResponse<IPagination<TurnEntity>>> {
    return await this.turnService.findAll(findDto);
  }

  @MessagePattern(TURN_MESSAGE_PATTERNS.FIND_BY_ID)
  async getTurnById(
    @Payload() id: string,
  ): Promise<IServiceResponse<TurnEntity>> {
    return await this.turnService.findById(id);
  }

  @MessagePattern(TURN_MESSAGE_PATTERNS.UPDATE)
  async updateInvitation(
    @Payload('id') id: string,
    @Payload('updateDto') updateDto: Partial<TurnEntity>,
  ): Promise<IServiceResponse<TurnEntity>> {
    return await this.turnService.update(id, updateDto);
  }

  @MessagePattern(TURN_MESSAGE_PATTERNS.REMOVE)
  async removeInvitation(
    @Payload() id: string,
  ): Promise<IServiceResponse<DeleteResult>> {
    return await this.turnService.remove(id);
  }
}
