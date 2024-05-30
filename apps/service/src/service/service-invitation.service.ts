import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInvitationEntity } from '../entity/service-invitation.entity';
import { Database } from '@app/database';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateServiceInvitationDto } from '../dto/invitation/create-service-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { ServiceEntity } from '../entity/service.entity';
import { IServiceResponse } from '@app/rabbit';
import { SERVICE_MAX_INVITATION_COUNT } from '../constant/service.constant';
import { ServiceMemberService } from './service-member.service';
import { ServiceService } from './service.service';
import { IPagination } from '@app/common';
import { FindCompaniesInvitationsDto } from '../dto/invitation/find-service-invitation';

@Injectable()
export class ServiceInvitationService {
  constructor(
    @InjectRepository(ServiceInvitationEntity, Database.PRIMARY)
    private serviceInvitationRepository: Repository<ServiceInvitationEntity>,
    private serviceService: ServiceService,
    private serviceMemberService: ServiceMemberService,
  ) {}

  async create({
    service,
  }: CreateServiceInvitationDto): Promise<
    IServiceResponse<ServiceInvitationEntity>
  > {
    let result;
    const { state: canCreate } = await this.validateMaxInviteCount(service);
    if (canCreate) {
      const invite = this.serviceInvitationRepository.create();
      invite.service = service;
      result = await this.serviceInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll({
    serviceId,
    limit,
    page,
  }: FindCompaniesInvitationsDto): Promise<
    IServiceResponse<IPagination<ServiceInvitationEntity>>
  > {
    const where = [serviceId ? { serviceId } : null];
    const invites = await this.serviceInvitationRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const invitesCount = await this.serviceInvitationRepository.count({
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
  ): Promise<IServiceResponse<ServiceInvitationEntity>> {
    const invite = await this.serviceInvitationRepository.findOneBy({ id });
    return {
      state: !!invite,
      data: invite,
    };
  }

  async findByActiveCode(
    code: string,
  ): Promise<IServiceResponse<ServiceInvitationEntity>> {
    const invite = await this.serviceInvitationRepository.findOneBy({
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
        const { data: service } = await this.serviceService.findById(
          invite.serviceId,
        );
        const { state: isJoined, data: serviceMember } =
          await this.serviceMemberService.create(service, user);
        if (isJoined) {
          result = invite;
        }
      }
    }
    return {
      state: !!result,
      data: result,
      message: `service.invitation-${!!result ? 'success' : 'invalid'}`,
    };
  }

  async update(
    id: string,
    updateDto: Partial<ServiceInvitationEntity>,
  ): Promise<IServiceResponse<ServiceInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      Object.assign(invite, updateDto);
      result = await this.serviceInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<ServiceInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      result = await this.serviceInvitationRepository.remove(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateMaxInviteCount(
    service: ServiceEntity,
  ): Promise<IServiceResponse<boolean>> {
    const invites = await this.serviceInvitationRepository.findBy({
      service: { id: service.id },
    });
    const valid = invites.length < SERVICE_MAX_INVITATION_COUNT;
    return {
      state: valid,
      data: valid,
    };
  }
}
