import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { OpenAIService } from '../openai/openai.service';
import { SocketGateway } from '@/services/socket/socket.gateway';
import { envs } from '@/config';
import { id } from 'ethers';
import { Comment } from '@/entities';

@Injectable()
export class CommentService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly openAIService: OpenAIService,
    private readonly socketGateway: SocketGateway,
  ) {}

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
    console.log(createCommentDto);
    let replyComment: Comment;
    if (replyId) {
      replyComment = await this.repository.comment.findOne({
        where: {
          id: replyId,
        },
        relations: {
          author: true,
        },
      });
      if (!replyComment) throw new NotFoundException('Reply comment không tồn tại');
    }

    await this.openAIService.moderateContent(content);

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

    if (replyId) {
      const userComment = await this.repository.user.findOneBy({ id: user.id });
      const notificationContent = `${userComment.fullName} đã trả lời bình luận của bạn trong một cuộc thảo luận`;
      const url = `${envs.fe.homeUrl}/project/${campaignId}/detail`;
      const newNotification = await this.repository.notification.save({
        content: notificationContent,
        url,
        user: {
          id: replyComment.author.id,
        },
        isRead: false,
      });

      this.socketGateway.emitEvent(
        'newNotification',
        {
          ...newNotification,
          to: replyComment.author.id,
        },
        [replyComment.author.id],
      );
    }

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
