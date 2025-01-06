import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { Message } from './message.entity';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class ChatRoomUser extends BaseEntity {
  @ManyToOne(() => ChatRoom, (chatroom) => chatroom.chatRoomUsers)
  chatRoom: ChatRoom;

  @ManyToOne(() => User, (user) => user.chatRoomUsers)
  user: User;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  lastSeenTime: Date;
}
