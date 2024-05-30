import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationInvitationEntity } from '../entity/location-invitation.entity';
import { Database } from '@app/database';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateLocationInvitationDto } from '../dto/invitation/create-location-invitation.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { LocationEntity } from '../entity/location.entity';
import { IServiceResponse } from '@app/rabbit';
import { LOCATION_MAX_INVITATION_COUNT } from '../constant/location.constant';
import { LocationMemberService } from './location-member.service';
import { LocationService } from './location.service';
import { IPagination } from '@app/common';
import { FindCompaniesInvitationsDto } from '../dto/invitation/find-location-invitation';

@Injectable()
export class LocationInvitationService {
  constructor(
    @InjectRepository(LocationInvitationEntity, Database.PRIMARY)
    private locationInvitationRepository: Repository<LocationInvitationEntity>,
    private locationService: LocationService,
    private locationMemberService: LocationMemberService,
  ) {}

  async create({
    location,
  }: CreateLocationInvitationDto): Promise<
    IServiceResponse<LocationInvitationEntity>
  > {
    let result;
    const { state: canCreate } = await this.validateMaxInviteCount(location);
    if (canCreate) {
      const invite = this.locationInvitationRepository.create();
      invite.location = location;
      result = await this.locationInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async findAll({
    locationId,
    limit,
    page,
  }: FindCompaniesInvitationsDto): Promise<
    IServiceResponse<IPagination<LocationInvitationEntity>>
  > {
    const where = [locationId ? { locationId } : null];
    const invites = await this.locationInvitationRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const invitesCount = await this.locationInvitationRepository.count({
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
  ): Promise<IServiceResponse<LocationInvitationEntity>> {
    const invite = await this.locationInvitationRepository.findOneBy({ id });
    return {
      state: !!invite,
      data: invite,
    };
  }

  async findByActiveCode(
    code: string,
  ): Promise<IServiceResponse<LocationInvitationEntity>> {
    const invite = await this.locationInvitationRepository.findOneBy({
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
        const { data: location } = await this.locationService.findById(
          invite.locationId,
        );
        const { state: isJoined, data: locationMember } =
          await this.locationMemberService.create(location, user);
        if (isJoined) {
          result = invite;
        }
      }
    }
    return {
      state: !!result,
      data: result,
      message: `location.invitation-${!!result ? 'success' : 'invalid'}`,
    };
  }

  async update(
    id: string,
    updateDto: Partial<LocationInvitationEntity>,
  ): Promise<IServiceResponse<LocationInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      Object.assign(invite, updateDto);
      result = await this.locationInvitationRepository.save(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async remove(id: string): Promise<IServiceResponse<LocationInvitationEntity>> {
    let result;
    const { state: finded, data: invite } = await this.findById(id);
    if (finded) {
      result = await this.locationInvitationRepository.remove(invite);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateMaxInviteCount(
    location: LocationEntity,
  ): Promise<IServiceResponse<boolean>> {
    const invites = await this.locationInvitationRepository.findBy({
      location: { id: location.id },
    });
    const valid = invites.length < LOCATION_MAX_INVITATION_COUNT;
    return {
      state: valid,
      data: valid,
    };
  }
}
