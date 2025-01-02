import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { ChatRoom } from './chat-room.entity';
import { MetadataMessageDto } from '@/api/chat/dto/metadata-chat.dto';

@Entity()
export class Message extends BaseEntity {
  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column('json', {
    nullable: true
  })
  metadata: MetadataMessageDto;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
    nullable: false,
  })
  chatRoom: ChatRoom;

  @Column()
  sentAt: Date;
}
