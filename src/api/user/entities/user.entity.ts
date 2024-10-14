import { Base as BaseEntity } from 'src/common/entities';
import { Column, Entity } from 'typeorm';
import { omit } from 'ramda';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({
    default: false,
  })
  isVerifiedEmail: boolean;

  @Column({
    default: false,
  })
  isVerifiedUser: boolean;

  @Column({
    default: false,
  })
  isAdmin: boolean;

  @Column({
    nullable: true,
  })
  facebookLink: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  address: string;

  public toResponse(): Omit<this, 'password'> {
    return {
      ...omit(['password', 'refreshToken'], this),
    };
  }
}
