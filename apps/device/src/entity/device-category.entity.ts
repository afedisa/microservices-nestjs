import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'device_category',
})
export class DeviceCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}
