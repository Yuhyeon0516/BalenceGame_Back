import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { Games } from "src/entities/games.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentService {
    constructor(@InjectRepository(Comment) private repo: Repository<Comment>) {}

    async writeComment(description: string, games: Games, user: User) {
        const comment = this.repo.create({ description, games, writer: user });

        return await this.repo.save(comment);
    }
}
