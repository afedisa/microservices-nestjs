import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'turn_category',
})
export class TurnCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}
