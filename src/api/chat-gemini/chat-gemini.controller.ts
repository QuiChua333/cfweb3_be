import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ChatGeminiService } from './chat-gemini.service';

@Controller('chat-gemini')
export class ChatGeminiController {
  constructor(private readonly chatGeminiService: ChatGeminiService) {}

  @Post("/:userId")
  async chat(@Body('message') message: string, @Param('userId') userId: string): Promise<any> {
    return this.chatGeminiService.sendMessage(userId, message);
  }

  @Get("/:userId")
  async getAllMessages(@Param('userId') userId: string): Promise<any> {
    return this.chatGeminiService.getMessagesOfUser(userId);
  }
}
