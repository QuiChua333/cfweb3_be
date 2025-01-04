import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "./base/base.entity";

@Entity()
export class ChatGemini extends BaseEntity {
    @ManyToOne(() => User, { nullable: false })
    user: User;
    @Column()
    content: String;
    @Column({default: false})
    isGemini: Boolean;
    @Column()
    sentAt: Date;
}
