import { Module } from '@nestjs/common';
import { ChatGeminiService } from './chat-gemini.service';
import { ChatGeminiController } from './chat-gemini.controller';

@Module({
  controllers: [ChatGeminiController],
  providers: [ChatGeminiService],
  exports: [ChatGeminiService],
})
export class ChatGeminiModule {}
