import { User } from '@/entities';
import { ChatRoom } from '@/entities/chat-room.entity';
import { Message } from '@/entities/message.entity';
import { RepositoryService } from '@/repositories/repository.service';
import { CloudinaryResponse } from '@/services/cloudinary/cloudinary.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, MoreThan, Not } from 'typeorm';
import { ITokenPayload } from '../auth/auth.interface';

@Injectable()
export class ChatService {
  constructor(private readonly repository: RepositoryService) {}

  async getHistoryChatList(currentUser: ITokenPayload) {
    const userId = currentUser.id;
    const user = await this.repository.user.findOne({
      where: {
        id: userId,
      },
      relations: {
        chatRoomUsers: {
          chatRoom: {
            chatRoomUsers: {
              user: true,
            },
          },
        },
      },
    });

    const chatRoomUsers = user.chatRoomUsers;
    const chatRoomUsersLength = chatRoomUsers.length;

    const chatListResponse = [];
    for (let i = 0; i < chatRoomUsersLength; i++) {
      const chatRoomUser = chatRoomUsers[i];
      const chatRoom = chatRoomUser.chatRoom;
      const chatRoomUsersTmp = chatRoom.chatRoomUsers;
      const targetUser = chatRoomUsersTmp.find((item) => item.user.id !== userId).user;
      const lastSeenTime = chatRoomUser.lastSeenTime;
      const unreadMessage = await this.repository.message.find({
        where: {
          chatRoom: {
            id: chatRoom.id,
          },
          sender: {
            id: Not(userId),
          },
          createdAt: MoreThan(lastSeenTime),
        },
      });
      const lastMessage = await this.repository.message.findOne({
        where: {
          chatRoom: {
            id: chatRoom.id,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      const lastMessageTime = lastMessage.createdAt;

      chatListResponse.push({
        user: {
          id: targetUser.id,
          fullName: targetUser.fullName,
          avatar: targetUser.avatar,
        },
        lastMessageTime,
        unreadMessageCount: unreadMessage.length,
        chatRoomId: chatRoom.id,
      });
    }

    return chatListResponse;
  }

  async saveMessage(chatRoomId: string, senderId: string, receiverId: string, content: string) {
    const chatRoom = await this.getOrCreateChatRoom(chatRoomId, senderId, receiverId);

    const newMessage = await this.repository.message.save({
      content,
      sender: {
        id: senderId,
      },
      chatRoom,
    });
    const chatRoomUser = await this.repository.chatRoomUser.findOne({
      where: {
        user: {
          id: senderId,
        },
        chatRoom: {
          id: chatRoom.id,
        },
      },
    });

    chatRoomUser.lastSeenTime = new Date();
    await this.repository.chatRoomUser.save(chatRoomUser);

    return {
      id: newMessage.id,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
      senderId: newMessage.sender.id,
      chatRoomId: chatRoom.id,
    };
  }

  async getOrCreateChatRoom(
    chatRoomId: string,
    senderId: string,
    receiverId: string,
  ): Promise<ChatRoom> {
    const sender = await this.repository.user.findOneBy({ id: senderId });
    const receiver = await this.repository.user.findOneBy({ id: receiverId });
    if (!(sender && receiver)) throw new BadRequestException('Người dùng không tồn tại');
    if (chatRoomId) {
      const existingRoom = await this.repository.chatRoom.findOne({
        where: {
          id: chatRoomId,
        },
      });

      if (!existingRoom) throw new BadRequestException('Phiên chat không tồn tại');

      return existingRoom;
    } else {
      const newChatRoom = await this.repository.chatRoom.save({});
      await this.repository.chatRoomUser.save({
        chatRoom: newChatRoom,
        user: sender,
      });

      await this.repository.chatRoomUser.save({
        chatRoom: newChatRoom,
        user: receiver,
      });

      return newChatRoom;
    }
  }
  async getMessages(chatRoomId: string) {
    if (!chatRoomId) return [];
    const chatRoom = await this.repository.chatRoom.findOne({
      where: {
        id: chatRoomId,
      },
      relations: {
        chatRoomUsers: {
          user: true,
        },
      },
    });
    if (!chatRoom) return [];

    const messages = await this.repository.message.find({
      where: {
        chatRoom: {
          id: chatRoom.id,
        },
        sender: {
          id: In(chatRoom.chatRoomUsers.map((item) => item.user.id)),
        },
      },
      relations: {
        sender: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return messages.map((message) => {
      const newMessageResponse = { ...message } as any;
      newMessageResponse.senderId = newMessageResponse.sender.id;
      delete newMessageResponse.sender;
      return newMessageResponse;
    });
  }
  async saveMessageWithFile(chatRoomId: string, file: CloudinaryResponse): Promise<Message> {
    const chatRoom = await this.repository.chatRoom.findOne({ where: { id: chatRoomId } });
    if (!chatRoom) throw new NotFoundException('Chat room not found');

    const message = this.repository.message.create({
      content: 'File uploaded',
      metadata: {
        files: [
          { fileName: file.original_filename, url: file.secure_url, public_id: file.public_id },
        ],
      },
      chatRoom,
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
