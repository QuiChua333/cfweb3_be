import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Perk } from './perk.entity';

@Entity()
export class ShippingFee extends BaseEntity {
  @Column()
  location: string;

  @Column({
    type: 'bigint',
  })
  fee: number;

  @ManyToOne(() => Perk, (perk) => perk.shippingFees, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  perk: Perk;
}
