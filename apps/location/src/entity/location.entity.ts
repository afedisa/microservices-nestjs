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
import { LocationCategoryEntity } from './location-category.entity';
import { LocationInvitationEntity } from './location-invitation.entity';
import { LocationMemberEntity } from './location-member.entity';

@Entity({
  name: 'location',
})
export class LocationEntity {
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
    (locationEntity: LocationEntity) => locationEntity.owner,
  )
  ownerId: string;

  @OneToMany(
    () => LocationMemberEntity,
    (locationMember) => locationMember.location,
  )
  members: LocationMemberEntity[];

  // @OneToMany(
  //   () => LocationInvitationEntity,
  //   (locationInviation) => locationInviation.location,
  // )
  // invitations: LocationInvitationEntity[];

  // @ManyToMany(() => LocationCategoryEntity)
  // @JoinTable()
  // categories: LocationCategoryEntity[];
}
