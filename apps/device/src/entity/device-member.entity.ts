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
import { DeviceEntity } from './device.entity';

@Entity({
  name: 'device_member',
})
export class DeviceMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priority: number;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @RelationId((deviceMember: DeviceMemberEntity) => deviceMember.user)
  userId: string;

  @ManyToOne(() => DeviceEntity, (device) => device.members, {
    onDelete: 'CASCADE',
  })
  device: DeviceEntity;

  @RelationId((deviceMember: DeviceMemberEntity) => deviceMember.device)
  deviceId: string;
}
