import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';

@Entity()
export class UserVerify extends BaseEntity {
  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  bod: Date;

  @Column()
  address: string;

  @Column()
  identifyNumber: string;

  @Column()
  identifyCardImageFront: string;

  @Column()
  identifyCardImageBack: string;

  @Column({
    default: true,
  })
  isNew: boolean;

  @OneToOne(() => User, (user) => user.userVerify)
  @JoinColumn()
  user: User;
}
