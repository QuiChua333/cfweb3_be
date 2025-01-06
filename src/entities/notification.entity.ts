import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';

@Entity()
export class Notification extends BaseEntity {
  @Column()
  content: string;

  @Column({
    nullable: true,
  })
  url: string;

  @Column({
    default: false,
  })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
