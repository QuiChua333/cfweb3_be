import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Campaign } from './campaign.entity';
import { DetailPerk } from './detail-perk.entity';
import { ShippingFee } from './shipping-fee.entity';
import { NFTCreateion } from './nft-creation.entity';

@Entity()
export class Perk extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'bigint',
  })
  price: number;

  @Column({
    nullable: true,
  })
  ethPrice: string;

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
    default: false,
  })
  isNFT: boolean;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column()
  estDeliveryDate: Date;

  @Column()
  description: string;

  @Column({
    nullable: true,
  })
  image: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.perks)
  campaign: Campaign;

  @OneToMany(() => DetailPerk, (detailPerk) => detailPerk.perk, {
    cascade: true,
  })
  detailPerks: DetailPerk[];

  @OneToMany(() => ShippingFee, (shippingFee) => shippingFee.perk, {
    cascade: true,
  })
  shippingFees: ShippingFee[];

  @OneToOne(() => NFTCreateion, (nftCreation) => nftCreation.perk, {
    cascade: true,
  })
  nftCreation: NFTCreateion;
}
