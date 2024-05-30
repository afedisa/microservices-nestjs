import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueInvitationEntity } from '../entity/queue-invitation.entity';
import { Database } from '@app/database';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateQueueInvitationDto } from '../dto/invitation/create-queue-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { QueueEntity } from '../entity/queue.entity';
import { IServiceResponse } from '@app/rabbit';
import { QUEUE_MAX_INVITATION_COUNT } from '../constant/queue.constant';
import { QueueMemberService } from './queue-member.service';
import { QueueService } from './queue.service';
import { IPagination } from '@app/common';
import { FindCompaniesInvitationsDto } from '../dto/invitation/find-queue-invitation';

@Injectable()
export class QueueInvitationService {
  constructor(
    @InjectRepository(QueueInvitationEntity, Database.PRIMARY)
    private queueInvitationRepository: Repository<QueueInvitationEntity>,
    private queueService: QueueService,
    private queueMemberService: QueueMemberService,
  ) {}

  async create({
    queue,
  }: CreateQueueInvitationDto): Promise<
    IServiceResponse<QueueInvitationEntity>
  > {
    let result;
    const { state: canCreate } = await this.validateMaxInviteCount(queue);
    if (canCreate) {
      const invite = this.queueInvitationRepository.create();
      invite.queue = queue;
      result = await this.queueInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll({
    queueId,
    limit,
    page,
  }: FindCompaniesInvitationsDto): Promise<
    IServiceResponse<IPagination<QueueInvitationEntity>>
  > {
    const where = [queueId ? { queueId } : null];
    const invites = await this.queueInvitationRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const invitesCount = await this.queueInvitationRepository.count({
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
  ): Promise<IServiceResponse<QueueInvitationEntity>> {
    const invite = await this.queueInvitationRepository.findOneBy({ id });
    return {
      state: !!invite,
      data: invite,
    };
  }

  async findByActiveCode(
    code: string,
  ): Promise<IServiceResponse<QueueInvitationEntity>> {
    const invite = await this.queueInvitationRepository.findOneBy({
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
        const { data: queue } = await this.queueService.findById(
          invite.queueId,
        );
        const { state: isJoined, data: queueMember } =
          await this.queueMemberService.create(queue, user);
        if (isJoined) {
          result = invite;
        }
      }
    }
    return {
      state: !!result,
      data: result,
      message: `queue.invitation-${!!result ? 'success' : 'invalid'}`,
    };
  }

  async update(
    id: string,
    updateDto: Partial<QueueInvitationEntity>,
  ): Promise<IServiceResponse<QueueInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      Object.assign(invite, updateDto);
      result = await this.queueInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<QueueInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      result = await this.queueInvitationRepository.remove(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateMaxInviteCount(
    queue: QueueEntity,
  ): Promise<IServiceResponse<boolean>> {
    const invites = await this.queueInvitationRepository.findBy({
      queue: { id: queue.id },
    });
    const valid = invites.length < QUEUE_MAX_INVITATION_COUNT;
    return {
      state: valid,
      data: valid,
    };
  }
}
