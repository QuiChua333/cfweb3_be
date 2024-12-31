import { OpenAIService } from './../openai/openai.service';
import { Body, Controller, HttpException, HttpStatus, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import CommentRoute from './comment.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Controller(CommentRoute.root)
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly openAIService: OpenAIService,
  ) {}

  @InjectRoute(CommentRoute.createComment)
  createComment(@User() user: ITokenPayload, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(user, createCommentDto);
  }

  @InjectRoute(CommentRoute.deleteComment)
  deleteComment(@User() user: ITokenPayload, @Param('commentId') commentId: string) {
    return this.commentService.deleteComment(user, commentId);
  }

  @InjectRoute(CommentRoute.updateComment)
  updateComment(
    @User() user: ITokenPayload,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(user, commentId, updateCommentDto);
  }

  @InjectRoute(CommentRoute.getCommentsByCampaignId)
  getCommentsByCampaignId(@Param('campaignId') campaignId: string) {
    return this.commentService.getCommentsByCampaignId(campaignId);
  }
}
