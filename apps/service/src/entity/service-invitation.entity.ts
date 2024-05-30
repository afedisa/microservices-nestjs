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
import { ServiceEntity } from './service.entity';
import { addHours } from 'date-fns';
import { SERVICE_INVITATION_EXPIRE_TIME } from '../constant/service.constant';

@Entity({
  name: 'service_invitation',
})
export class ServiceInvitationEntity {
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

  @ManyToOne(() => ServiceEntity, (service) => service.invitations)
  service: ServiceEntity;

  @RelationId(
    (serviceInvitation: ServiceInvitationEntity) => serviceInvitation.service,
  )
  serviceId: string;

  @BeforeInsert()
  onBeforeInsert() {
    this.code = _.uniqueId();
    this.expire = addHours(new Date(), SERVICE_INVITATION_EXPIRE_TIME);
  }
}
