import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class ChatGeminiService {
  constructor(
    private readonly repository: RepositoryService,
  ) {}

  async getMessagesOfUser(userId: string) {
    try {
      const user = await this.repository.user.findOne({
        where: {
          id: userId
        }
      });
      if (!user) {
        throw new BadRequestException('UserId không tồn tại');
      }
      const messages = await this.repository.chatGemini.find({
        where: {
          user: { id: userId },
        },
        order: {
          sentAt: 'ASC',
        },
      });

      const res = messages.map(item => {
        return {
          sentAt: item.sentAt,
          content: item.content,
          isGemini: item.isGemini,
        }
      })
      
      return res;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new HttpException(
        'Failed to fetch messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  async sendMessage(userId: string, message: string): Promise<any> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const user = await this.repository.user.findOne({
      where: {
        id: userId
      }
    });
    if (!user) {
      throw new BadRequestException('UserId không tồn tại');
    }
    // Lưu thông tin message của người dùng vào database
    await this.repository.chatGemini.save({
      user: { id: userId },
      content: message,
      isGemini: false,
      sentAt: new Date(),
    });

    try {
      const result = await model.generateContent(message);
      const msgGemini = result.response.candidates[0].content.parts[0].text;

      // Lưu thông tin message của Gemini vào database
      const resultGemini = {
        user: { id: userId },
        content: msgGemini,
        isGemini: true,
        sentAt: new Date(),
      }
      const res = await this.repository.chatGemini.save(resultGemini);

      return {
        content: res.content,
        isGemini: true,
        sentAt: res.sentAt,
      };
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to connect to Gemini API',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
