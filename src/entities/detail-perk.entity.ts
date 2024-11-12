import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Item } from './item.entity';
import { Perk } from './perk.entity';

@Entity()
export class DetailPerk extends BaseEntity {
  @Column()
  quantity: number;

  @ManyToOne(() => Perk, (perk) => perk.detailPerks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  perk: Perk;

  @ManyToOne(() => Item, (item) => item.detailPerks)
  item: Item;
}
