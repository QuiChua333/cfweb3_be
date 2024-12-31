import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    try {
      const response = await this.openai.moderations.create({
        model: "omni-moderation-latest",
        input: content,
      });
      const flagged = response.results.some((result) => result.flagged);
      return {
        isValid: !flagged
      };
    } catch (error) {
      throw new HttpException(
        'Error with OpenAI Moderation API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
