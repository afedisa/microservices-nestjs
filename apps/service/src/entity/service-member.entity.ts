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
import { ServiceEntity } from './service.entity';

@Entity({
  name: 'service_member',
})
export class ServiceMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priority: number;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @RelationId((serviceMember: ServiceMemberEntity) => serviceMember.user)
  userId: string;

  @ManyToOne(() => ServiceEntity, (service) => service.members, {
    onDelete: 'CASCADE',
  })
  service: ServiceEntity;

  @RelationId((serviceMember: ServiceMemberEntity) => serviceMember.service)
  serviceId: string;
}
