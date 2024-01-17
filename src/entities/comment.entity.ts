import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @Column()
    description: string;

    @CreateDateColumn({ default: new Date(), type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.uid)
    writer: User;
}
