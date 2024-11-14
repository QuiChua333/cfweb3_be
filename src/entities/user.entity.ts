import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { UserStatus, VerifyStatus } from '@/constants';
import { UserVerify } from './user-verify.entity';
import { Campaign } from './campaign.entity';
import { TeamMember } from './team-member.entity';
import { FollowCampaign } from './follow-campaign.entity';
import { Contribution } from './contribution.entity';
import { Report } from './report.entity';
import { Gift } from './gift.entity';
import { Comment } from './comment.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({
    default: false,
  })
  isVerifiedEmail: boolean;

  @Column({
    default: VerifyStatus.UNVERIFY,
    type: 'enum',
    enum: VerifyStatus,
  })
  verifyStatus: VerifyStatus;

  @Column({
    default: UserStatus.ACTIVATE,
    type: 'enum',
    enum: UserStatus,
  })
  userStatus: UserStatus;

  @Column({
    default: false,
  })
  isAdmin: boolean;

  @Column({
    nullable: true,
  })
  facebookLink: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  address: string;

  @OneToOne(() => UserVerify, (userVerify) => userVerify.user)
  userVerify: UserVerify;

  @OneToMany(() => Campaign, (campaign) => campaign.owner)
  campaigns: Campaign[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.user)
  teamMembers: TeamMember[];

  @OneToMany(() => FollowCampaign, (followCampaign) => followCampaign.user)
  followCampaigns: FollowCampaign[];

  @OneToMany(() => Contribution, (contribution) => contribution.user)
  contributions: Contribution[];

  @OneToMany(() => Comment, (comment) => comment.author, {
    cascade: true,
  })
  authoredComments: Comment[];

  @OneToMany(() => Comment, (comment) => comment.tag, {
    cascade: true,
  })
  taggedComments: Comment[];

  @OneToMany(() => Report, (report) => report.reportBy)
  reports: Report[];

  @OneToMany(() => Gift, (gift) => gift.campaign)
  gifts: Gift[];
}
