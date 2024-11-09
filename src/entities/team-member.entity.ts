import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ConfirmMemberStatus } from '@/constants';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class TeamMember extends BaseEntity {
  @Column({
    nullable: true,
    default: '',
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ConfirmMemberStatus,
    default: ConfirmMemberStatus.PENDING,
  })
  confirmStatus: ConfirmMemberStatus;

  @Column({
    default: false,
  })
  isEdit: boolean;

  @Column()
  email: string;

  @ManyToOne(() => User, (user) => user.teamMembers, {
    nullable: true,
  })
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.teamMembers)
  campaign: Campaign;
}
