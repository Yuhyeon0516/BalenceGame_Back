import {
    Body,
    Controller,
    Get,
    Headers,
    Post,
    Query,
    Request,
    UseGuards,
} from "@nestjs/common";
import { GamesService } from "./games.service";
import { GameService } from "./game.service";
import { CommentService } from "./comment.service";
import {
    ApiBody,
    ApiResponse,
    ApiTags,
    ApiOperation,
    ApiHeaders,
    ApiHeader,
} from "@nestjs/swagger";
import { GamesDto } from "./dtos/games.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { Serialize } from "src/interceptors/serialize.interceptor";

@Controller("games")
@ApiTags("게임 API")
export class GamesController {
    constructor(
        private gamesService: GamesService,
        private gameService: GameService,
        private commentService: CommentService,
    ) {}

    @Post("/create")
    @UseGuards(AuthGuard)
    @ApiHeader({
        name: "Authorization",
        description: "Bearer {{token}}",
    })
    @ApiBody({ type: GamesDto.Request.Create })
    @ApiOperation({ summary: "게임 생성", description: "게임 생성" })
    @ApiResponse({
        status: 201,
        description: "게임 생성 성공",
    })
    @ApiResponse({ status: 401, description: "접근권한 없음" })
    async create(@Body() body: GamesDto.Request.Create, @Request() req: any) {
        const game1 = await this.gameService.create(
            body.game[0].title,
            body.game[0].description,
        );
        const game2 = await this.gameService.create(
            body.game[0].title,
            body.game[1].description,
        );

        this.gamesService.create(
            body.category,
            body.title,
            game1,
            game2,
            req.user,
        );

        return;
    }

    @Get()
    @Serialize(GamesDto.Response.AllGames)
    @ApiOperation({ summary: "모든 게임 조회", description: "모든 게임 조회" })
    @ApiResponse({
        status: 200,
        description: "모든 게임 조회 성공",
        type: [GamesDto.Response.AllGames],
    })
    async allGames() {
        return this.gamesService.allGames();
    }
}
