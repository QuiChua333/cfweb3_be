import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { CampaignStatus } from '@/constants';
import { User } from './user.entity';
import { Item } from './item.entity';

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
}
