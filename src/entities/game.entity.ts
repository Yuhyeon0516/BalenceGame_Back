import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
