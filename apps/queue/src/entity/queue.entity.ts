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
import { QueueCategoryEntity } from './queue-category.entity';
import { QueueInvitationEntity } from './queue-invitation.entity';
import { QueueMemberEntity } from './queue-member.entity';

@Entity({
  name: 'queue',
})
export class QueueEntity {
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
    (queueEntity: QueueEntity) => queueEntity.owner,
  )
  ownerId: string;

  @OneToMany(
    () => QueueMemberEntity,
    (queueMember) => queueMember.queue,
  )
  members: QueueMemberEntity[];

  // @OneToMany(
  //   () => QueueInvitationEntity,
  //   (queueInviation) => queueInviation.queue,
  // )
  // invitations: QueueInvitationEntity[];

  // @ManyToMany(() => QueueCategoryEntity)
  // @JoinTable()
  // categories: QueueCategoryEntity[];
}
