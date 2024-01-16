import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
