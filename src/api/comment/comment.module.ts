import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [OpenAIModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
