import { Module } from "@nestjs/common";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { GameService } from "./game.service";
import { CommentService } from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { Game } from "src/entities/game.entity";
import { Games } from "src/entities/games.entity";
import { JwtStrategy } from "src/auth/security/passport.jwt";
import { AuthService } from "src/auth/auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Game, Games, User]),
        PassportModule,
    ],
    controllers: [GamesController],
    providers: [
        GamesService,
        GameService,
        CommentService,
        JwtStrategy,
        AuthService,
        JwtService,
    ],
})
export class GamesModule {}
