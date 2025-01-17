import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, CloudinaryService],
  exports: [ChatService],
})
export class ChatModule {}
