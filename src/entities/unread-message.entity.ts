import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from './user.entity';

@Entity('unread_messages')
export class UnreadMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id)
  chatRoom: ChatRoom;

  @ManyToOne(() => User, (user) => user.unreadMessages)
  user: User;

  @Column({ default: 0 })
  unreadCount: number;
}
