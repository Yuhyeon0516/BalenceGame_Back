import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Games } from "./games.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    uid: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    nickname: string;

    @CreateDateColumn({ default: new Date(), type: "timestamp" })
    createdAt: Date;

    @OneToMany(() => Comment, (comment) => comment.writer)
    writedComments: Comment[];

    @OneToMany(() => Games, (games) => games.writer)
    createdGames: Games[];

    @OneToMany(() => Games, (games) => games.gamesId)
    playedGames: Games[];
}
