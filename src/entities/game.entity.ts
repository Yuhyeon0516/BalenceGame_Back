import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Games } from "./games.entity";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    gameId: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: 0 })
    selectedCount: number;

    @Column({ default: 0 })
    selectedRatio: number;

    @ManyToOne(() => Games, (games) => games.game)
    games: Games;
}
