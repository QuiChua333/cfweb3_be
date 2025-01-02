import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class ChatRoom extends BaseEntity {
  @ManyToOne(() => User, { nullable: false })
  userA: User;

  @ManyToOne(() => User, { nullable: false })
  userB: User;

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
