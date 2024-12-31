import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import ChatRoute from './chat.routes';
import { InjectRoute } from '@/decorators';

@Controller(ChatRoute.root)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @InjectRoute(ChatRoute.getChatRooms)
  async getChatRooms(@Param('userId') userId: string) {
    return this.chatService.getChatRooms(userId);
  }

  @InjectRoute(ChatRoute.sendMessage)
  @UseInterceptors(FileInterceptor('file'))
  async sendMessage(
    @Body('chatRoomId') chatRoomId: string,
    @Body('senderId') senderId: string,
    @Body('content') content: string,
    @UploadedFile() file?: Express.Multer.File, // Nhận file từ request
  ) {
    return this.chatService.sendMessage(chatRoomId, senderId, content, file);
  }
  
  @InjectRoute(ChatRoute.resetUnread)
  async resetUnread(@Body('chatRoomId') chatRoomId: string, @Body('userId') userId: string) {
    return this.chatService.resetUnread(chatRoomId, userId);
  }
  @InjectRoute(ChatRoute.createChatRoom)
    async createChatRoom(
      @Body('userId1') userId1: string,
      @Body('userId2') userId2: string,
    ) {
      return this.chatService.createChatRoom(userId1, userId2);
    }
}
