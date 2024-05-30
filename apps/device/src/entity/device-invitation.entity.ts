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
import { DeviceEntity } from './device.entity';
import { addHours } from 'date-fns';
import { DEVICE_INVITATION_EXPIRE_TIME } from '../constant/device.constant';

@Entity({
  name: 'device_invitation',
})
export class DeviceInvitationEntity {
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

  @ManyToOne(() => DeviceEntity, (device) => device.invitations)
  device: DeviceEntity;

  @RelationId(
    (deviceInvitation: DeviceInvitationEntity) => deviceInvitation.device,
  )
  deviceId: string;

  @BeforeInsert()
  onBeforeInsert() {
    this.code = _.uniqueId();
    this.expire = addHours(new Date(), DEVICE_INVITATION_EXPIRE_TIME);
  }
}
