import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { CommentLike } from './comment-like.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  reply: Comment;

  // Quan hệ OneToMany để lấy tất cả các phản hồi của một bình luận
  @OneToMany(() => Comment, (comment) => comment.reply)
  replies: Comment[];

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  tag: User;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.comments)
  campaign: Campaign;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment, {
    cascade: true,
  })
  commentLikes: CommentLike[];
}
