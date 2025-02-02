import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Campaign } from './campaign.entity';
import { PaymentMethod, PaymentStatus } from '@/constants';
import { User } from './user.entity';

@Entity()
export class Contribution extends BaseEntity {
  @Column()
  email: string;

  @Column()
  bankName: string;

  @Column()
  bankAccountNumber: string;

  @Column()
  bankUsername: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  shippingInfo: Object;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  perks: Object;

  @Column({
    nullable: true,
  })
  date: Date;

  @Column({
    type: 'bigint',
  })
  amount: number;

  @Column({
    type: 'bigint',
  })
  totalPayment: number;

  @Column({
    nullable: true,
  })
  amountCrypto: string;

  @Column({
    nullable: true,
  })
  customerWalletAddress: string;

  @Column({
    nullable: true,
  })
  transactionHash: string;

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

  @Column({
    default: false,
  })
  isFinish: boolean;

  @Column({
    nullable: true,
  })
  receiptUrl: string;

  @Column({
    nullable: true,
  })
  stripePaymentId: string;

  @Column({
    default: false,
  })
  isRefund: boolean;

  @Column({
    nullable: true,
  })
  proofImage: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.contributions)
  campaign: Campaign;

  @ManyToOne(() => User, (user) => user.contributions, { nullable: true })
  user: User;
}
