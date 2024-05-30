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
import { QueueEntity } from './queue.entity';

@Entity({
  name: 'queue_member',
})
export class QueueMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priority: number;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @RelationId((queueMember: QueueMemberEntity) => queueMember.user)
  userId: string;

  @ManyToOne(() => QueueEntity, (queue) => queue.members, {
    onDelete: 'CASCADE',
  })
  queue: QueueEntity;

  @RelationId((queueMember: QueueMemberEntity) => queueMember.queue)
  queueId: string;
}
