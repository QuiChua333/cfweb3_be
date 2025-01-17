import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { CampaignStatus } from '@/constants';
import { User } from './user.entity';
import { Item } from './item.entity';
import { Perk } from './perk.entity';
import { Field } from './field.entity';
import { FAQ } from './faq.entity';
import { TeamMember } from './team-member.entity';
import { FollowCampaign } from './follow-campaign.entity';
import { Comment } from './comment.entity';
import { Contribution } from './contribution.entity';
import { Report } from './report.entity';
import { Gift } from './gift.entity';
import { MappingTypeMapping } from '@elastic/elasticsearch/lib/api/types';

@Entity()
export class Campaign extends BaseEntity {
  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  tagline: string;

  @Column({
    nullable: true,
  })
  imageDetailPage: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({
    nullable: true,
  })
  publishedAt: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  duration: number;

  @Column({
    nullable: true,
  })
  finishedAt: Date;

  @Column({
    nullable: true,
  })
  cardImage: string;

  @Column({
    nullable: true,
  })
  youtubeUrl: string;

  @Column({
    nullable: true,
  })
  story: string;

  @Column({
    nullable: true,
  })
  bankName: string;

  @Column({
    nullable: true,
  })
  bankAccountNumber: string;

  @Column({
    nullable: true,
  })
  bankUsername: string;

  @Column({
    nullable: true,
  })
  goal: number;

  @Column({
    default: false,
  })
  isSend: boolean;

  @Column({
    default: false,
  })
  isRefund: boolean;

  @Column({
    nullable: true,
  })
  proofImage: string;

  @Column({
    default: false,
  })
  cryptocurrencyMode: boolean;

  @Column({
    nullable: true,
  })
  walletAddress: string;

  @ManyToOne(() => User, (user) => user.userVerify)
  owner: User;

  @Column({
    type: 'uuid',
  })
  ownerId: string;

  @OneToMany(() => Item, (item) => item.campaign)
  items: Item[];

  @OneToMany(() => Perk, (perk) => perk.campaign)
  perks: Perk[];

  @ManyToOne(() => Field, (field) => field.campaigns)
  field: Field;

  @OneToMany(() => FAQ, (faq) => faq.campaign, {
    cascade: ['remove'],
  })
  faqs: FAQ[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.campaign)
  teamMembers: TeamMember[];

  @OneToMany(() => FollowCampaign, (followCampaign) => followCampaign.campaign)
  followCampaigns: FollowCampaign[];

  @OneToMany(() => Comment, (comment) => comment.campaign)
  comments: Comment[];

  @OneToMany(() => Contribution, (contribution) => contribution.campaign)
  contributions: Contribution[];

  @OneToMany(() => Report, (report) => report.campaign)
  reports: Report[];

  @OneToMany(() => Gift, (gift) => gift.campaign)
  gifts: Gift[];

  @DeleteDateColumn()
  deletedAt?: Date;
}

export const ESCampaignMapping: MappingTypeMapping = {
  properties: {
    id: { type: 'keyword' },
    title: { type: 'text' },
    tagline: { type: 'text' },
    location: { type: 'text' },
    status: { type: 'keyword' },
    publishedAt: { type: 'date' },
    duration: { type: 'integer' },
    goal: { type: 'float' },
    authorName: { type: 'text' },
    authorEmail: { type: 'text' },
    story: { type: 'text' },
    field: { type: 'keyword' },
    fieldGroup: { type: 'keyword' },
    cardImage: { type: 'text' },
  },
};
