import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../interface/role.interface';
import { VehicleEntity } from 'apps/vehicle/src/entity/vehicle.entity';
import { StorageFileEntity } from 'apps/storage/src/entity/storage-file.entity';
import { CompanyEntity } from 'apps/company/src/entity/company.entity';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({
    type: 'simple-array',
    default: [Role.USER],
    transformer: {
      from: (value) => JSON.parse(value),
      to: (value) => JSON.stringify(value),
    },
  })
  roles: Role[];

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: false })
  nationalcode: string;

  @Column({ nullable: true })
  birthday: Date;

  // @OneToOne(() => StorageFileEntity, (storageFile) => storageFile.id, {
  //   eager: true,
  //   onDelete: 'SET NULL',
  // })
  // avatar: StorageFileEntity;

  // @OneToMany(() => VehicleEntity, (vehicle) => vehicle.user)
  // vehicles: VehicleEntity[];

  // @OneToMany(() => StorageFileEntity, (storageFile) => storageFile.user)
  // files: StorageFileEntity[];

  @ManyToOne(() => CompanyEntity, (company) => company.members)
  company: CompanyEntity;
}
