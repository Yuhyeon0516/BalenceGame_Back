import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "src/entities/game.entity";
import { Repository } from "typeorm";

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private repo: Repository<Game>) {}

    create(title: string, description: string) {
        const game = this.repo.create({ title, description });

        return this.repo.save(game);
    }

    update(game: Partial<Game>) {
        return this.repo.save(game);
    }
}
