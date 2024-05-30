import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'organization_category',
})
export class OrganizationCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}
