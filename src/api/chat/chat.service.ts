import { User } from '@/entities';
import { ChatRoom } from '@/entities/chat-room.entity';
import { Message } from '@/entities/message.entity';
import { UnreadMessage } from '@/entities/unread-message.entity';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(UnreadMessage)
    private unreadMessageRepository: Repository<UnreadMessage>,
    private readonly cloudinaryService: CloudinaryService, // Inject CloudinaryService
  ) {}

  // Lấy danh sách chat rooms
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    return this.chatRoomRepository.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2', 'messages'],
    });
  }

  // Gửi tin nhắn
  async sendMessage(
    chatRoomId: string,
    senderId: string,
    content: string,
    file?: Express.Multer.File, // Nhận file từ request
  ): Promise<Message> {
    let fileUrl: string | undefined;

    // Upload file lên Cloudinary nếu có
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      fileUrl = uploadResult.secure_url;
    }

    // Tạo và lưu tin nhắn
    const message = this.messageRepository.create({
      chatRoom: { id: chatRoomId },
      sender: { id: senderId },
      content,
      fileUrl,
    });
    return this.messageRepository.save(message);
  }

  // Cập nhật số tin nhắn chưa đọc
  async incrementUnread(chatRoomId: string, receiverId: string): Promise<void> {
    await this.unreadMessageRepository.increment({ chatRoom: { id: chatRoomId }, user: { id: receiverId } }, 'unreadCount', 1);
  }

  async resetUnread(chatRoomId: string, userId: string): Promise<void> {
    await this.unreadMessageRepository.update({ chatRoom: { id: chatRoomId }, user: { id: userId } }, { unreadCount: 0 });
  }

  async createChatRoom(userId1: string, userId2: string) {
    const chatRoom = this.chatRoomRepository.create({ user1: { id: userId1 }, user2: { id: userId2 } });
    return this.chatRoomRepository.save(chatRoom);
  }
}
