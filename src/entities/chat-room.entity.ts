import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.chatRoomsAsUser1)
  user1: User;

  @ManyToOne(() => User, (user) => user.chatRoomsAsUser2)
  user2: User;

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
