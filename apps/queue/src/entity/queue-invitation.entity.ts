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
import { QueueEntity } from './queue.entity';
import { addHours } from 'date-fns';
import { QUEUE_INVITATION_EXPIRE_TIME } from '../constant/queue.constant';

@Entity({
  name: 'queue_invitation',
})
export class QueueInvitationEntity {
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

  @ManyToOne(() => QueueEntity, (queue) => queue.invitations)
  queue: QueueEntity;

  @RelationId(
    (queueInvitation: QueueInvitationEntity) => queueInvitation.queue,
  )
  queueId: string;

  @BeforeInsert()
  onBeforeInsert() {
    this.code = _.uniqueId();
    this.expire = addHours(new Date(), QUEUE_INVITATION_EXPIRE_TIME);
  }
}
