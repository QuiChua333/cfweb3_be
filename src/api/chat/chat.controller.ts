import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly cloudinary: CloudinaryService
  ) {}

  @Post('room')
  async getOrCreateChatRoom(
    @Body() body: { userAId: string; userBId: string },
  ) {
    const { userAId, userBId } = body;
    return await this.chatService.getOrCreateChatRoom(userAId, userBId);
  }

  @Get('room/:roomId/messages')
  async getMessages(@Param('roomId') roomId: string) {
    return await this.chatService.getMessages(roomId);
  }
  @Post('upload')
  async uploadFile(@Body() body: { chatRoomId: string; file: Express.Multer.File }) {
    const uploadedFile = await this.cloudinary.uploadFiles(body.file);
    return await this.chatService.saveMessageWithFile(body.chatRoomId, uploadedFile);
  }
  @Post('message/:id/read')
  async markAsRead(@Param('id') messageId: string) {
    return await this.chatService.markMessageAsRead(messageId);
  }

}
