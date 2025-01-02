import { User } from '@/entities';
import { ChatRoom } from '@/entities/chat-room.entity';
import { Message } from '@/entities/message.entity';
import { RepositoryService } from '@/repositories/repository.service';
import { CloudinaryResponse } from '@/services/cloudinary/cloudinary.service';
import { Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class ChatService {
  constructor(
    private readonly repository: RepositoryService,
  ) {}

  async getOrCreateChatRoom(userAId: string, userBId: string): Promise<ChatRoom> {
    const existingRoom = await this.repository.chatRoom.findOne({
      where: [
        { userA: { id: userAId }, userB: { id: userBId } },
        { userA: { id: userBId }, userB: { id: userAId } },
      ],
    });

    if (existingRoom) return existingRoom;

    const userA = await this.repository.user.findOne({ where: { id: userAId } });
    const userB = await this.repository.user.findOne({ where: { id: userBId } });

    if (!userA || !userB) {
      throw new NotFoundException('User not found');
    }

    const newRoom = this.repository.chatRoom.create({ userA, userB });
    return await this.repository.chatRoom.save(newRoom);
  }

  async saveMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const chatRoom = await this.getOrCreateChatRoom(senderId, receiverId);

    const message = this.repository.message.create({
      content,
      sender: { id: senderId } as User,
      chatRoom,
      sentAt: new Date(),
    });

    return await this.repository.message.save(message);
  }

  async getMessages(chatRoomId: string) {
    const res = await this.repository.message.find({
      where: { chatRoom: { id: chatRoomId } },
      relations: ['sender', 'chatRoom'],
      order: { sentAt: 'ASC' },
    });
    const messages = res.map((message) => ({
      ...message,
      metadata: message.metadata || {},
    }));
    return messages;
  }
  async saveMessageWithFile(chatRoomId: string, file: CloudinaryResponse): Promise<Message> {
    const chatRoom = await this.repository.chatRoom.findOne({ where: { id: chatRoomId } });
    if (!chatRoom) throw new NotFoundException('Chat room not found');
  
    const message = this.repository.message.create({
      content: 'File uploaded',
      metadata: { files: [{ fileName: file.original_filename, url: file.secure_url, public_id: file.public_id }] },
      chatRoom,
      sentAt: new Date(),
    });
  
    return await this.repository.message.save(message);
  }
  async markMessageAsRead(messageId: string): Promise<Message> {
    const message = await this.repository.message.findOne({ where: { id: messageId } });
    if (!message) throw new NotFoundException('Message not found');
  
    message.isRead = true;
    return await this.repository.message.save(message);
  }
  
  
}
