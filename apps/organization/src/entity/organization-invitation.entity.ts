import _ from 'lodash';
import { UserEntity } from 'apps/user/src/entity/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { addHours } from 'date-fns';
import { ORGANIZATION_INVITATION_EXPIRE_TIME } from '../constant/organization.constant';

@Entity({
  name: 'organization_invitation',
})
export class OrganizationInvitationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  expire: Date;

  @Column({ default: false })
  use: boolean;

  @OneToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  usedBy: UserEntity;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.invitations)
  organization: OrganizationEntity;

  @RelationId(
    (organizationInvitation: OrganizationInvitationEntity) => organizationInvitation.organization,
  )
  organizationId: string;

  @BeforeInsert()
  onBeforeInsert() {
    this.code = _.uniqueId();
    this.expire = addHours(new Date(), ORGANIZATION_INVITATION_EXPIRE_TIME);
  }
}
