import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TurnInvitationEntity } from '../entity/turn-invitation.entity';
import { Database } from '@app/database';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateTurnInvitationDto } from '../dto/invitation/create-turn-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { TurnEntity } from '../entity/turn.entity';
import { IServiceResponse } from '@app/rabbit';
import { TURN_MAX_INVITATION_COUNT } from '../constant/turn.constant';
import { TurnMemberService } from './turn-member.service';
import { TurnService } from './turn.service';
import { IPagination } from '@app/common';
import { FindCompaniesInvitationsDto } from '../dto/invitation/find-turn-invitation';

@Injectable()
export class TurnInvitationService {
  constructor(
    @InjectRepository(TurnInvitationEntity, Database.PRIMARY)
    private turnInvitationRepository: Repository<TurnInvitationEntity>,
    private turnService: TurnService,
    private turnMemberService: TurnMemberService,
  ) {}

  async create({
    turn,
  }: CreateTurnInvitationDto): Promise<
    IServiceResponse<TurnInvitationEntity>
  > {
    let result;
    const { state: canCreate } = await this.validateMaxInviteCount(turn);
    if (canCreate) {
      const invite = this.turnInvitationRepository.create();
      invite.turn = turn;
      result = await this.turnInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll({
    turnId,
    limit,
    page,
  }: FindCompaniesInvitationsDto): Promise<
    IServiceResponse<IPagination<TurnInvitationEntity>>
  > {
    const where = [turnId ? { turnId } : null];
    const invites = await this.turnInvitationRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const invitesCount = await this.turnInvitationRepository.count({
      where,
    });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: invites,
        total: Math.ceil(invitesCount / limit),
      },
    };
  }

  async findById(
    id: string,
  ): Promise<IServiceResponse<TurnInvitationEntity>> {
    const invite = await this.turnInvitationRepository.findOneBy({ id });
    return {
      state: !!invite,
      data: invite,
    };
  }

  async findByActiveCode(
    code: string,
  ): Promise<IServiceResponse<TurnInvitationEntity>> {
    const invite = await this.turnInvitationRepository.findOneBy({
      code,
      use: false,
      expire: MoreThanOrEqual(new Date()),
    });
    return {
      state: !!invite,
      data: invite,
    };
  }

  async use(
    code: string,
    user: UserEntity,
  ): Promise<IServiceResponse<boolean>> {
    let result;
    const { state: finded, data: { id } = { id: null } } =
      await this.findByActiveCode(code);
    if (finded) {
      const { state: updated, data: invite } = await this.update(id, {
        use: true,
      });
      if (updated) {
        const { data: turn } = await this.turnService.findById(
          invite.turnId,
        );
        const { state: isJoined, data: turnMember } =
          await this.turnMemberService.create(turn, user);
        if (isJoined) {
          result = invite;
        }
      }
    }
    return {
      state: !!result,
      data: result,
      message: `turn.invitation-${!!result ? 'success' : 'invalid'}`,
    };
  }

  async update(
    id: string,
    updateDto: Partial<TurnInvitationEntity>,
  ): Promise<IServiceResponse<TurnInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      Object.assign(invite, updateDto);
      result = await this.turnInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<TurnInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      result = await this.turnInvitationRepository.remove(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateMaxInviteCount(
    turn: TurnEntity,
  ): Promise<IServiceResponse<boolean>> {
    const invites = await this.turnInvitationRepository.findBy({
      turn: { id: turn.id },
    });
    const valid = invites.length < TURN_MAX_INVITATION_COUNT;
    return {
      state: valid,
      data: valid,
    };
  }
}
