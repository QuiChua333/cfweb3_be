import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Campaign } from './campaign.entity';
import { PaymentMethod, PaymentStatus } from '@/constants';
import { User } from './user.entity';
import { ContributionDetail } from './contribution-detail.entity';

@Entity()
export class Contribution extends BaseEntity {
  @Column()
  email: string;

  @Column()
  shippingAddress: string;

  @Column()
  date: Date;

  @Column({
    type: 'bigint',
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @ManyToOne(() => Campaign, (campaign) => campaign.contributions)
  campaign: Campaign;

  @ManyToOne(() => User, (user) => user.contributions, { nullable: true })
  user: User;

  @OneToOne(() => ContributionDetail, (contributionDetail) => contributionDetail.contribution)
  contributionDetail: ContributionDetail;
}
