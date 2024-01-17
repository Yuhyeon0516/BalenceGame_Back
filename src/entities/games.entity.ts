import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Game } from "./game.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Games {
    @PrimaryGeneratedColumn()
    gamesId: number;

    @Column()
    category: string;

    @Column()
    title: string;

    @Column()
    ddescription: string;

    @Column({ default: 0 })
    like: number;

    @Column({ default: 0 })
    dislike: number;

    @CreateDateColumn({ default: new Date(), type: "timestamp" })
    createdAt: Date;

    @Column()
    totalPlayer: number;

    @ManyToOne(() => User, (user) => user.createdGames)
    writer: User;

    @OneToMany(() => Game, (game) => game.gameId)
    game: Game[];

    @OneToMany(() => Comment, (comment) => comment.commentId)
    comment: Comment[];
}
