import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private readonly repository: RepositoryService) {}

  async checkAuthorComment(user: ITokenPayload, commentId: string) {
    const comment = await this.repository.comment.findOne({
      where: {
        id: commentId,
      },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Bình luận không tồn tại');
    if (comment.author.id !== user.id)
      throw new BadRequestException('Không có quyền xóa bình luận');
    return comment;
  }

  async createComment(user: ITokenPayload, createCommentDto: CreateCommentDto) {
    const { content, campaignId, replyId, tagId } = createCommentDto;
    if (replyId) {
      const replyComment = await this.repository.comment.findOneBy({ id: replyId });
      if (!replyComment) throw new NotFoundException('Reply comment không tồn tại');
    }
    const newComment = await this.repository.comment.save({
      content,
      author: {
        id: user.id,
      },
      reply: {
        id: replyId,
      },
      tag: {
        id: tagId,
      },
      campaign: {
        id: campaignId,
      },
    });

    const response = await this.repository.comment.findOne({
      where: {
        id: newComment.id,
      },
      relations: {
        author: true,
        tag: true,
        replies: true,
        reply: true,
        commentLikes: {
          user: true,
        },
      },
      select: {
        reply: {
          id: true,
        },
        author: {
          id: true,
          avatar: true,
          fullName: true,
        },
        tag: {
          id: true,
          avatar: true,
          fullName: true,
        },
        replies: true,
      },
    });
    return {
      ...response,
      commentLikes: response.commentLikes.map((item) => item.user.id),
    };
  }

  async deleteComment(user: ITokenPayload, commentId: string) {
    const comment = await this.checkAuthorComment(user, commentId);
    return await this.repository.comment.remove(comment);
  }

  async updateComment(user: ITokenPayload, commentId: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.checkAuthorComment(user, commentId);
    comment.content = updateCommentDto.content;
    return await this.repository.comment.save(comment);
  }

  async getCommentsByCampaignId(campaignId: string) {
    const comments = await this.repository.comment.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
      relations: {
        author: true,
        tag: true,
        replies: true,
        reply: true,
        commentLikes: {
          user: true,
        },
      },
      select: {
        reply: {
          id: true,
        },
        author: {
          id: true,
          avatar: true,
          fullName: true,
        },
        tag: {
          id: true,
          avatar: true,
          fullName: true,
        },
        replies: true,
      },
    });

    return comments.map((comment) => ({
      ...comment,
      commentLikes: comment.commentLikes.map((item) => item.user.id),
    }));
  }
}
