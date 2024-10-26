import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';
import { UpdateCommentLikeDto } from './dto/update-comment-like.dto';
import CommentLikeRoute from './comment-like.routes';
import { InjectRoute } from '@/decorators';

@Controller(CommentLikeRoute.root)
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @Post()
  create(@Body() createCommentLikeDto: CreateCommentLikeDto) {
    return this.commentLikeService.create(createCommentLikeDto);
  }

  @InjectRoute(CommentLikeRoute.findAll)
  findAll() {
    return this.commentLikeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentLikeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentLikeDto: UpdateCommentLikeDto) {
    return this.commentLikeService.update(+id, updateCommentLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentLikeService.remove(+id);
  }
}
