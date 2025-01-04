import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { Message } from './message.entity';
import { ChatRoomUser } from './chat-room-user.entity';

@Entity()
export class ChatRoom extends BaseEntity {
  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];

  @OneToMany(() => ChatRoomUser, (chatRoomUser) => chatRoomUser.chatRoom)
  chatRoomUsers: ChatRoomUser[];
}
