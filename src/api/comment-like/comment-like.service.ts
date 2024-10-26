import { Injectable } from '@nestjs/common';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';
import { UpdateCommentLikeDto } from './dto/update-comment-like.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class CommentLikeService {
  constructor(private readonly repository: RepositoryService) {}
  create(createCommentLikeDto: CreateCommentLikeDto) {
    return 'This action adds a new commentLike';
  }

  findAll() {
    return `This action returns all commentLike`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentLike`;
  }

  update(id: number, updateCommentLikeDto: UpdateCommentLikeDto) {
    return `This action updates a #${id} commentLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentLike`;
  }
}
