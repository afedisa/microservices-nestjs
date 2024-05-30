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
import { TurnEntity } from './turn.entity';
import { addHours } from 'date-fns';
import { TURN_INVITATION_EXPIRE_TIME } from '../constant/turn.constant';

@Entity({
  name: 'turn_invitation',
})
export class TurnInvitationEntity {
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

  @ManyToOne(() => TurnEntity, (turn) => turn.invitations)
  turn: TurnEntity;

  @RelationId(
    (turnInvitation: TurnInvitationEntity) => turnInvitation.turn,
  )
  turnId: string;

  @BeforeInsert()
  onBeforeInsert() {
    this.code = _.uniqueId();
    this.expire = addHours(new Date(), TURN_INVITATION_EXPIRE_TIME);
  }
}
