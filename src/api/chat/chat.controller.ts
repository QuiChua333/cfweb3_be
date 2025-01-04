import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import ChatRoute from './chat.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';

@Controller(ChatRoute.root)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // @Get('room/:roomId/messages')
  // async getMessages(@Param('roomId') roomId: string) {
  //   return await this.chatService.getMessages(roomId);
  // }
  @Post('upload')
  async uploadFile(@Body() body: { chatRoomId: string; file: Express.Multer.File }) {
    const uploadedFile = await this.cloudinary.uploadFiles(body.file);
    return await this.chatService.saveMessageWithFile(body.chatRoomId, uploadedFile);
  }
  @Post('message/:id/read')
  async markAsRead(@Param('id') messageId: string) {
    return await this.chatService.markMessageAsRead(messageId);
  }

  @InjectRoute(ChatRoute.getHistoryChatList)
  async getHistoryChatList(@User() currentUser: ITokenPayload) {
    return await this.chatService.getHistoryChatList(currentUser);
  }
}
