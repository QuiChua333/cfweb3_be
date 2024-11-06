import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class Gift extends BaseEntity {
  @Column({
    type: 'jsonb',
  })
  shippingInfo: Object;

  @Column({
    type: 'jsonb',
  })
  perks: Object;

  @Column()
  money: number;

  @Column({
    default: false,
  })
  isFinish: boolean;

  @ManyToOne(() => User, (user) => user.gifts)
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.gifts)
  campaign: Campaign;
}
