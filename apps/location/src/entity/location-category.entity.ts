import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'location_category',
})
export class LocationCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}
