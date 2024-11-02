import { Injectable } from '@nestjs/common';

import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateCommentLikeDto } from './dto';

@Injectable()
export class CommentLikeService {
  constructor(private readonly repository: RepositoryService) {}

  async likeComment(user: ITokenPayload, createCommenLikeDto: CreateCommentLikeDto) {
    const commentLike = await this.repository.commentLike.findOne({
      where: {
        user: {
          id: user.id,
        },
        comment: {
          id: createCommenLikeDto.commentId,
        },
      },
    });

    if (!commentLike) {
      return await this.repository.commentLike.save({
        user: {
          id: user.id,
        },
        comment: {
          id: createCommenLikeDto.commentId,
        },
      });
    } else {
      return await this.repository.commentLike.remove(commentLike);
    }
  }
}
