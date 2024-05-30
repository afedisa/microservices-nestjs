import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'queue_category',
})
export class QueueCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}
