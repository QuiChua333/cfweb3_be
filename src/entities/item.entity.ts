import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Campaign } from './campaign.entity';
import { Option } from './option.entity';
import { DetailPerk } from './detail-perk.entity';

@Entity()
export class Item extends BaseEntity {
  @Column()
  name: string;

  @Column({
    default: false,
  })
  isHasOption: boolean;

  @ManyToOne(() => Campaign, (campaign) => campaign.items)
  campaign: Campaign;

  @OneToMany(() => Option, (option) => option.item, {
    cascade: true,
  })
  options: Option[];

  @OneToMany(() => DetailPerk, (detailPerk) => detailPerk.item)
  detailPerks: DetailPerk[];
}
