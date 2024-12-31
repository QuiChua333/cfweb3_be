import { Controller, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import OpenAIRoute from './openai.routes';
import { InjectRoute } from '@/decorators';

@Controller(OpenAIRoute.root)
export class OpenaiController {
  constructor(private readonly openaiService: OpenAIService) {}

  @InjectRoute(OpenAIRoute.moderateContent)
  async moderateContent(@Body('content') content: string) {
    if (!content) {
      throw new HttpException('Content is required', HttpStatus.BAD_REQUEST);
    }
    return this.openaiService.moderateContent(content);
  }
}
