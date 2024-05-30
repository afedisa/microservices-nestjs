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
import { TurnEntity } from './turn.entity';

@Entity({
  name: 'turn_member',
})
export class TurnMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priority: number;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @RelationId((turnMember: TurnMemberEntity) => turnMember.user)
  userId: string;

  @ManyToOne(() => TurnEntity, (turn) => turn.members, {
    onDelete: 'CASCADE',
  })
  turn: TurnEntity;

  @RelationId((turnMember: TurnMemberEntity) => turnMember.turn)
  turnId: string;
}
