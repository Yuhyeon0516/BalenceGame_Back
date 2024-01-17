import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "src/entities/game.entity";
import { Games } from "src/entities/games.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class GamesService {
    constructor(@InjectRepository(Games) private repo: Repository<Games>) {}

    create(
        category: string,
        title: string,
        game1: Game,
        game2: Game,
        user: User,
    ) {
        const games = this.repo.create({
            category,
            title,
            game: [game1, game2],
            writer: user,
        });

        return this.repo.save(games);
    }

    async allGames() {
        return await this.repo.find({
            relations: ["game", "writer"],
        });
    }

    async categoryGames(category: string) {
        const games = await this.repo.find({
            where: { category },
            relations: ["game", "writer"],
        });

        return games.length ? games : null;
    }
}
