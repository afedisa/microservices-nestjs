import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'service_category',
})
export class ServiceCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}
