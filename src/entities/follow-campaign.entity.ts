import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Item } from './item.entity';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class FollowCampaign extends BaseEntity {
  @ManyToOne(() => User, (user) => user.followCampaigns)
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.followCampaigns)
  campaign: Campaign;
}
