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
import { LocationEntity } from './location.entity';

@Entity({
  name: 'location_member',
})
export class LocationMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priority: number;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @RelationId((locationMember: LocationMemberEntity) => locationMember.user)
  userId: string;

  @ManyToOne(() => LocationEntity, (location) => location.members, {
    onDelete: 'CASCADE',
  })
  location: LocationEntity;

  @RelationId((locationMember: LocationMemberEntity) => locationMember.location)
  locationId: string;
}
