import { UserEntity } from 'apps/user/src/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity({
  name: 'organization_member',
})
export class OrganizationMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priority: number;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @RelationId((organizationMember: OrganizationMemberEntity) => organizationMember.user)
  userId: string;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.members, {
    onDelete: 'CASCADE',
  })
  organization: OrganizationEntity;

  @RelationId((organizationMember: OrganizationMemberEntity) => organizationMember.organization)
  organizationId: string;
}
