import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class CommentLike extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes)
  comment: Comment;
}
