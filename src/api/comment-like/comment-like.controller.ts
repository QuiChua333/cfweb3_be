import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import CommentLikeRoute from './comment-like.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateCommentLikeDto } from './dto';

@Controller(CommentLikeRoute.root)
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @InjectRoute(CommentLikeRoute.likeComment)
  likeComment(@User() user: ITokenPayload, @Body() createCommenLikeDto: CreateCommentLikeDto) {
    return this.commentLikeService.likeComment(user, createCommenLikeDto);
  }
}
