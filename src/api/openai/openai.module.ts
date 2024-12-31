import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenaiController } from './openai.controller';

@Module({
  controllers: [OpenaiController],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
