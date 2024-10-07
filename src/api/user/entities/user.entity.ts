import { Base as BaseEntity } from 'src/common/entities';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({
    default: false,
  })
  isAdmin: boolean;
}
