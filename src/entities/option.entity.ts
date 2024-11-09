import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Item } from './item.entity';

@Entity()
export class Option extends BaseEntity {
  @Column()
  name: string;

  @Column()
  values: string;

  @ManyToOne(() => Item, (item) => item.options, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  item: Item;
}
