import { UserEntity } from 'apps/user/src/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
// import { DeviceCategoryEntity } from './device-category.entity';

@Entity({
  name: 'device',
})
export class DeviceEntity {
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

  @RelationId((deviceEntity: DeviceEntity) => deviceEntity.owner)
  ownerId: string;

  // @ManyToMany(() => DeviceCategoryEntity)
  // @JoinTable()
  // categories: DeviceCategoryEntity[];
}
