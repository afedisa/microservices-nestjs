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
import { LocationEntity } from './location.entity';
import { addHours } from 'date-fns';
import { LOCATION_INVITATION_EXPIRE_TIME } from '../constant/location.constant';

@Entity({
  name: 'location_invitation',
})
export class LocationInvitationEntity {
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

  @ManyToOne(() => LocationEntity, (location) => location.invitations)
  location: LocationEntity;

  @RelationId(
    (locationInvitation: LocationInvitationEntity) => locationInvitation.location,
  )
  locationId: string;

  @BeforeInsert()
  onBeforeInsert() {
    this.code = _.uniqueId();
    this.expire = addHours(new Date(), LOCATION_INVITATION_EXPIRE_TIME);
  }
}
