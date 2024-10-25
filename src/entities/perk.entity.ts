import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Campaign } from './campaign.entity';
import { DetailPerk } from './detail-perk.entity';
import { ShippingFee } from './shippng-fee.entity';

@Entity()
export class Perk extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'bigint',
  })
  price: number;

  @Column({
    default: false,
  })
  isFeatured: boolean;

  @Column({
    default: true,
  })
  isVisible: boolean;

  @Column({
    default: false,
  })
  isShipping: boolean;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column()
  estDeliveryDate: Date;

  @Column()
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.perks)
  campaign: Campaign;

  @OneToMany(() => DetailPerk, (detailPerk) => detailPerk.perk)
  detailPerks: DetailPerk[];

  @OneToMany(() => ShippingFee, (shippingFee) => shippingFee.perk)
  shippingFees: ShippingFee[];
}
