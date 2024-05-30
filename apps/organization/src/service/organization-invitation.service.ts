import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationInvitationEntity } from '../entity/organization-invitation.entity';
import { Database } from '@app/database';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateOrganizationInvitationDto } from '../dto/invitation/create-organization-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { OrganizationEntity } from '../entity/organization.entity';
import { IServiceResponse } from '@app/rabbit';
import { ORGANIZATION_MAX_INVITATION_COUNT } from '../constant/organization.constant';
import { OrganizationMemberService } from './organization-member.service';
import { OrganizationService } from './organization.service';
import { IPagination } from '@app/common';
import { FindCompaniesInvitationsDto } from '../dto/invitation/find-organization-invitation';

@Injectable()
export class OrganizationInvitationService {
  constructor(
    @InjectRepository(OrganizationInvitationEntity, Database.PRIMARY)
    private organizationInvitationRepository: Repository<OrganizationInvitationEntity>,
    private organizationService: OrganizationService,
    private organizationMemberService: OrganizationMemberService,
  ) {}

  async create({
    organization,
  }: CreateOrganizationInvitationDto): Promise<
    IServiceResponse<OrganizationInvitationEntity>
  > {
    let result;
    const { state: canCreate } = await this.validateMaxInviteCount(organization);
    if (canCreate) {
      const invite = this.organizationInvitationRepository.create();
      invite.organization = organization;
      result = await this.organizationInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll({
    organizationId,
    limit,
    page,
  }: FindCompaniesInvitationsDto): Promise<
    IServiceResponse<IPagination<OrganizationInvitationEntity>>
  > {
    const where = [organizationId ? { organizationId } : null];
    const invites = await this.organizationInvitationRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const invitesCount = await this.organizationInvitationRepository.count({
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
  ): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    const invite = await this.organizationInvitationRepository.findOneBy({ id });
    return {
      state: !!invite,
      data: invite,
    };
  }

  async findByActiveCode(
    code: string,
  ): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    const invite = await this.organizationInvitationRepository.findOneBy({
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
        const { data: organization } = await this.organizationService.findById(
          invite.organizationId,
        );
        const { state: isJoined, data: organizationMember } =
          await this.organizationMemberService.create(organization, user);
        if (isJoined) {
          result = invite;
        }
      }
    }
    return {
      state: !!result,
      data: result,
      message: `organization.invitation-${!!result ? 'success' : 'invalid'}`,
    };
  }

  async update(
    id: string,
    updateDto: Partial<OrganizationInvitationEntity>,
  ): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      Object.assign(invite, updateDto);
      result = await this.organizationInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<OrganizationInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      result = await this.organizationInvitationRepository.remove(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateMaxInviteCount(
    organization: OrganizationEntity,
  ): Promise<IServiceResponse<boolean>> {
    const invites = await this.organizationInvitationRepository.findBy({
      organization: { id: organization.id },
    });
    const valid = invites.length < ORGANIZATION_MAX_INVITATION_COUNT;
    return {
      state: valid,
      data: valid,
    };
  }
}
