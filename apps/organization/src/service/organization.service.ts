import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationEntity } from '../entity/organization.entity';
import { Database } from '@app/database';
import { Like, Repository } from 'typeorm';
import { IServiceResponse } from '@app/rabbit';
import { CreateOrganizationDto } from '../dto/organization/create-organization.dto';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { FindCompaniesDto } from '../dto/organization/find-organization.dto';
import { IPagination } from '@app/common';
import { ORGANIZATION_MAX_COUNT_PER_USER } from '../constant/organization.constant';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity, Database.PRIMARY)
    private organizationRepository: Repository<OrganizationEntity>,
  ) {}

  async create(
    createDto: CreateOrganizationDto,
    user: UserEntity,
  ): Promise<IServiceResponse<OrganizationEntity>> {
    let result;
    const { state: canCreate } = await this.validateOrganizationCountLimitation(
      user.id,
    );
    if (canCreate) {
      const organization = this.organizationRepository.create(createDto);
      organization.owner = user;
      result = await this.organizationRepository.save(organization);
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
  }: FindCompaniesDto): Promise<IServiceResponse<IPagination<OrganizationEntity>>> {
    limit = limit || 20;
    page = page || 1;
    const where = [
      name ? { name: Like(name) } : { name: 'IS NOT NULL' },
      enabled ? { enabled } : { enabled: true },
    ];
    const companies = await this.organizationRepository.find({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });
    const organizationCount = await this.organizationRepository.count({ where });
    return {
      state: true,
      data: {
        limit: limit,
        page: page,
        items: companies,
        total: Math.ceil(organizationCount / limit),
      },
    };
  }

  async findById(id: string): Promise<IServiceResponse<OrganizationEntity>> {
    const organization = await this.organizationRepository.findOneBy({ id });
    return {
      state: !!organization,
      data: organization,
    };
  }

  async update(
    id: string,
    updateDto: Partial<OrganizationEntity>,
  ): Promise<IServiceResponse<OrganizationEntity>> {
    let result;
    const { state: finded, data: organization } = await this.findById(id);
    if (finded) {
      Object.assign(organization, updateDto);
      result = await this.organizationRepository.save(organization);
    }
    return {
      state: !!result,
      data: result,
    };
  }

  async validateOrganizationCountLimitation(
    userId: string,
  ): Promise<IServiceResponse<boolean>> {
    const ownedCompanies = await this.organizationRepository.findBy({
      ownerId: userId,
    });
    const valid = ownedCompanies.length < ORGANIZATION_MAX_COUNT_PER_USER;
    return {
      state: valid,
      data: valid,
    };
  }
}
