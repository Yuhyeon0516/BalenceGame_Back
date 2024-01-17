import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameService } from './game.service';
import { CommentService } from './comment.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, GameService, CommentService]
})
export class GamesModule {}
