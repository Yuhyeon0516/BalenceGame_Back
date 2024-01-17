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
import { Games } from "./games.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;

    @Column()
    description: string;

    @CreateDateColumn({ default: new Date(), type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.uid, { eager: true })
    writer: User;

    @ManyToOne(() => Games, (games) => games.comment)
    games: Games;
}
