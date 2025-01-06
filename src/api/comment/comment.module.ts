import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { OpenAIModule } from '../openai/openai.module';
import { SocketModule } from '@/services/socket/socket.module';

@Module({
  imports: [OpenAIModule, SocketModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
