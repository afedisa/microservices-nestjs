import { DatabaseType } from 'typeorm';
import { Database } from '../interface/database.interface';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import { AuthRequestEntity } from 'apps/auth/src/entity/auth-request.entity';
import { VehicleEntity } from 'apps/vehicle/src/entity/vehicle.entity';
import { StorageFileEntity } from 'apps/storage/src/entity/storage-file.entity';
import { CompanyEntity } from 'apps/company/src/entity/company.entity';
import { CompanyMemberEntity } from 'apps/company/src/entity/company-member.entity';
import { CompanyInvitationEntity } from 'apps/company/src/entity/company-invitation.entity';
import { CompanyCategoryEntity } from 'apps/company/src/entity/company-category.entity';
import { OrganizationInvitationEntity } from 'apps/organization/src/entity/organization-invitation.entity';
import { OrganizationMemberEntity } from 'apps/organization/src/entity/organization-member.entity';
import { OrganizationEntity } from 'apps/organization/src/entity/organization.entity';
import { ServiceEntity } from 'apps/service/src/entity/service.entity';
import { DeviceEntity } from 'apps/device/src/entity/device.entity';
import { DeviceCategoryEntity } from 'apps/device/src/entity/device-category.entity';
import { LocationMemberEntity } from 'apps/location/src/entity/location-member.entity';
import { LocationEntity } from 'apps/location/src/entity/location.entity';
import { QueueEntity } from 'apps/queue/src/entity/queue.entity';
import { TurnInvitationEntity } from 'apps/turn/src/entity/turn-invitation.entity';
import { TurnMemberEntity } from 'apps/turn/src/entity/turn-member.entity';
import { TurnEntity } from 'apps/turn/src/entity/turn.entity';

export const DATABASE_CONFIG: Record<
  Database,
  { type: DatabaseType; env: string; entities: EntityClassOrSchema[] }
> = {
  primary: {
    type: 'postgres',
    env: 'PRIMARY',
    entities: [
      DeviceEntity,
      DeviceCategoryEntity,
      QueueEntity,
      TurnEntity,
      TurnMemberEntity,
      TurnInvitationEntity,
      LocationEntity,
      LocationMemberEntity,
      ServiceEntity,
      OrganizationEntity,
      OrganizationMemberEntity,
      OrganizationInvitationEntity,
      CompanyCategoryEntity,
      CompanyEntity,
      CompanyMemberEntity,
      CompanyInvitationEntity,
      UserEntity,
      AuthRequestEntity,
      VehicleEntity,
      StorageFileEntity,
    ],
  },
  secondary: {
    type: 'postgres',
    env: 'SECONDARY',
    entities: [],
  },
};
