import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Item } from './item.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class FAQ extends BaseEntity {
  @Column()
  question: string;

  @Column()
  answer: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.faqs)
  campaign: Campaign;
}
