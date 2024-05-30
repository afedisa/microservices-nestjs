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
import { ServiceCategoryEntity } from './service-category.entity';
import { ServiceInvitationEntity } from './service-invitation.entity';
import { ServiceMemberEntity } from './service-member.entity';

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

  @RelationId(
    (serviceEntity: ServiceEntity) => serviceEntity.owner,
  )
  ownerId: string;

  @OneToMany(
    () => ServiceMemberEntity,
    (serviceMember) => serviceMember.service,
  )
  members: ServiceMemberEntity[];

  // @OneToMany(
  //   () => ServiceInvitationEntity,
  //   (serviceInviation) => serviceInviation.service,
  // )
  // invitations: ServiceInvitationEntity[];

  // @ManyToMany(() => ServiceCategoryEntity)
  // @JoinTable()
  // categories: ServiceCategoryEntity[];
}
