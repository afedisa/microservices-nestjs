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
import { TurnCategoryEntity } from './turn-category.entity';
import { TurnInvitationEntity } from './turn-invitation.entity';
import { TurnMemberEntity } from './turn-member.entity';

@Entity({
  name: 'turn',
})
export class TurnEntity {
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
    (turnEntity: TurnEntity) => turnEntity.owner,
  )
  ownerId: string;

  @OneToMany(
    () => TurnMemberEntity,
    (turnMember) => turnMember.turn,
  )
  members: TurnMemberEntity[];

  // @OneToMany(
  //   () => TurnInvitationEntity,
  //   (turnInviation) => turnInviation.turn,
  // )
  // invitations: TurnInvitationEntity[];

  // @ManyToMany(() => TurnCategoryEntity)
  // @JoinTable()
  // categories: TurnCategoryEntity[];
}
