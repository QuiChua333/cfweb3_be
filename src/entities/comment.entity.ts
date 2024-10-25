import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { CommentLike } from './comment-like.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  content: string;

  @Column()
  values: string;

  @OneToOne(() => Comment)
  @JoinColumn()
  parent: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.comments)
  campaign: Campaign;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  commentLikes: CommentLike[];
}
