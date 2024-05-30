import { UserEntity } from 'apps/user/src/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { OrganizationCategoryEntity } from './organization-category.entity';
import { OrganizationInvitationEntity } from './organization-invitation.entity';
import { OrganizationMemberEntity } from './organization-member.entity';

@Entity({
  name: 'organization',
})
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  enabled: boolean;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn()
  owner: UserEntity;

  @RelationId(
    (organizationEntity: OrganizationEntity) => organizationEntity.owner,
  )
  ownerId: string;

  @OneToMany(
    () => OrganizationMemberEntity,
    (organizationMember) => organizationMember.organization,
  )
  members: OrganizationMemberEntity[];

  // @OneToMany(
  //   () => OrganizationInvitationEntity,
  //   (organizationInviation) => organizationInviation.organization,
  // )
  // invitations: OrganizationInvitationEntity[];

  // @ManyToMany(() => OrganizationCategoryEntity)
  // @JoinTable()
  // categories: OrganizationCategoryEntity[];
}
