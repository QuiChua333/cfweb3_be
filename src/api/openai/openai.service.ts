import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async moderateContent(content: string) {
    const response = await this.openai.moderations.create({
      model: 'omni-moderation-latest',
      input: content,
    });
    const flagged = response.results?.[0].flagged;
    if (flagged === false) throw new BadRequestException('Nội dung bình luận không phù hợp');
  }
}
