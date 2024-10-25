import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
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

@Entity()
export class Campaign extends BaseEntity {
  @Column()
  title: string;

  @Column()
  tagline: string;

  @Column()
  imageDetailPage: string;

  @Column()
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
  })
  duration: number;

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
    type: 'bigint',
  })
  goal: number;

  @ManyToOne(() => User, (user) => user.userVerify)
  owner: User;

  @OneToMany(() => Item, (item) => item.campaign)
  items: Item[];

  @OneToMany(() => Perk, (perk) => perk.campaign)
  perks: Perk[];

  @ManyToOne(() => Field, (field) => field.campaigns)
  field: Field;

  @OneToMany(() => FAQ, (faq) => faq.campaign)
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
}
