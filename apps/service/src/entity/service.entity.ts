import { UserEntity } from 'apps/user/src/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity({
  name: 'service',
})
export class ServiceEntity {
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

  @RelationId((serviceEntity: ServiceEntity) => serviceEntity.owner)
  ownerId: string;
}
