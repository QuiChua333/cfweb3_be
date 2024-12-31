import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { User } from '@/entities';
import { ChatRoom } from '@/entities/chat-room.entity';
import { Message } from '@/entities/message.entity';
import { UnreadMessage } from '@/entities/unread-message.entity';
import { ChatGateway } from './chat.gateway';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChatRoom, Message, UnreadMessage]), CloudinaryModule],
  providers: [ChatService, ChatGateway,CloudinaryService],
  controllers: [ChatController],
})
export class ChatModule {}
