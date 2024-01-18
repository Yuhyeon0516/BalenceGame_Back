import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
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
    ApiHeader,
} from "@nestjs/swagger";
import { GamesDto } from "./dtos/games.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { CommentDto } from "./dtos/comment.dto";
import { Games } from "src/entities/games.entity";
import { Game } from "src/entities/game.entity";

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
    async create(@Body() body: GamesDto.Request.Create, @Req() req: any) {
        const game1 = await this.gameService.create(
            body.game[0].title,
            body.game[0].description,
        );
        const game2 = await this.gameService.create(
            body.game[1].title,
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

    @Get("/:category")
    @Serialize(GamesDto.Response.AllGames)
    @ApiOperation({
        summary: "카테고리별 게임 조회",
        description: "카테고리별 게임 조회",
    })
    @ApiResponse({
        status: 200,
        description: "카테고리별 게임 조회 성공",
        type: [GamesDto.Response.AllGames],
    })
    async categoryGames(@Param("category") category: string) {
        return this.gamesService.categoryGames(category);
    }

    @Post("/:gamesId/comment")
    @Serialize(GamesDto.Response.AllGames)
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: "게임에 댓글 작성",
        description: "게임에 댓글 작성",
    })
    @ApiHeader({
        name: "Authorization",
        description: "Bearer {{token}}",
    })
    @ApiBody({ type: CommentDto.Request.WriteComment })
    @ApiResponse({
        status: 201,
        description: "댓글 작성 성공",
        type: GamesDto.Response.AllGames,
    })
    @ApiResponse({ status: 401, description: "접근권한 없음" })
    async writeComment(
        @Param("gamesId") gamesId: string,
        @Body() body: CommentDto.Request.WriteComment,
        @Req() req: any,
    ) {
        if (!gamesId) {
            throw new NotFoundException("경로가 잘못되었습니다.");
        }
        const games = await this.gamesService.findById(parseInt(gamesId));

        if (!games) {
            throw new NotFoundException("게임을 찾을 수 없습니다.");
        }

        await this.commentService.writeComment(
            body.description,
            games,
            req.user,
        );

        return await this.gamesService.findById(parseInt(gamesId));
    }

    @Post("/:gamesId/select")
    @Serialize(GamesDto.Response.AllGames)
    @ApiOperation({
        summary: "투표",
        description: "투표",
    })
    @ApiBody({ type: GamesDto.Request.SelectGame })
    @ApiResponse({
        status: 201,
        description: "투표 완료",
        type: GamesDto.Response.AllGames,
    })
    @ApiResponse({ status: 404, description: "Requests Miss" })
    async selectGame(
        @Param("gamesId") gamesId: string,
        @Body() body: GamesDto.Request.SelectGame,
    ) {
        if (!gamesId) {
            throw new NotFoundException("경로가 잘못되었습니다.");
        }

        const games = await this.gamesService.findById(parseInt(gamesId));

        if (!games) {
            throw new NotFoundException("게임을 찾을 수 없습니다.");
        }

        const [selectedGame] = games.game.filter(
            (game) => game.gameId === body.gameId,
        );

        const [notSelectedGame] = games.game.filter(
            (game) => game.gameId !== body.gameId,
        );

        if (!selectedGame) {
            throw new NotFoundException("선택된 게임 ID가 잘못되었습니다.");
        }

        Object.assign(games, {
            totalPlayer: games.totalPlayer + 1,
        } as Games);

        await this.gamesService.update(games);

        Object.assign(selectedGame, {
            selectedCount: selectedGame.selectedCount + 1,
            selectedRatio: Math.round(
                ((selectedGame.selectedCount + 1) / games.totalPlayer) * 100,
            ),
        } as Game);

        Object.assign(notSelectedGame, {
            selectedRatio: Math.round(
                (notSelectedGame.selectedCount / games.totalPlayer) * 100,
            ),
        } as Game);

        await this.gameService.update(selectedGame);
        await this.gameService.update(notSelectedGame);

        return games;
    }

    @Get("/:gamesId/like")
    @Serialize(GamesDto.Response.AllGames)
    @ApiOperation({
        summary: "좋아요",
        description: "좋아요 선택",
    })
    @ApiResponse({
        status: 200,
        description: "좋아요 표시 완료",
        type: GamesDto.Response.AllGames,
    })
    @ApiResponse({ status: 404, description: "Requests Miss" })
    async like(@Param("gamesId") gamesId: string) {
        const games = await this.gamesService.findById(parseInt(gamesId));

        if (!games) {
            throw new NotFoundException("게임을 찾을 수 없습니다.");
        }

        Object.assign(games, { like: games.like + 1 });

        return await this.gamesService.update(games);
    }

    @Get("/:gamesId/dislike")
    @Serialize(GamesDto.Response.AllGames)
    @ApiOperation({
        summary: "싫어요",
        description: "싫어요 선택",
    })
    @ApiResponse({
        status: 200,
        description: "싫어요 표시 완료",
        type: GamesDto.Response.AllGames,
    })
    @ApiResponse({ status: 404, description: "Requests Miss" })
    async dislike(@Param("gamesId") gamesId: string) {
        const games = await this.gamesService.findById(parseInt(gamesId));

        if (!games) {
            throw new NotFoundException("게임을 찾을 수 없습니다.");
        }

        Object.assign(games, { dislike: games.dislike + 1 });

        return await this.gamesService.update(games);
    }
}
