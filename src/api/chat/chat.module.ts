import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from '@/services/socket/chat-getway';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, CloudinaryService],
  exports: [ChatService]
})
export class ChatModule {}
