import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsString,
    Length,
    ValidateNested,
} from "class-validator";
import { GameDto } from "./game.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { UserDto } from "src/auth/dtos/user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { CommentDto } from "./comment.dto";

export namespace GamesDto {
    export namespace Request {
        export class Create {
            @IsString()
            @ApiProperty({ description: "카테고리", example: "상황" })
            category: string;

            @IsString()
            @ApiProperty({ description: "제목", example: "게임 타이틀" })
            title: string;

            @IsArray()
            @ArrayMaxSize(2)
            @ArrayMinSize(2)
            @ApiProperty({
                description: "게임 내용",
                example: [
                    {
                        title: "게임 선택 제목1",
                        description: "게임 선택 설명1",
                    },
                    {
                        title: "게임 선택 제목2",
                        description: "게임 선택 설명2",
                    },
                ],
            })
            game: GameDto.Request.Create[];
        }
    }

    export namespace Response {
        export class AllGames {
            @Expose()
            @ApiProperty({ description: "게임의 고유 ID", example: 1 })
            gamesId: number;

            @Expose()
            @ApiProperty({ description: "카테고리", example: "상황" })
            category: string;

            @Expose()
            @ApiProperty({ description: "게임의 제목", example: "게임 제목 1" })
            title: string;

            @Expose()
            @ApiProperty({ description: "좋아요의 수", example: 1 })
            like: number;

            @Expose()
            @ApiProperty({ description: "좋아요의 수", example: 0 })
            dislike: number;

            @Expose()
            @ApiProperty({
                description: "게임이 생성된 날짜",
                example: "2024-01-16T22:45:27.621Z",
            })
            createdAt: Date;

            @Expose()
            @ApiProperty({
                description: "이 게임을 플레이한 횟수",
                example: 123,
            })
            totalPlayer: number;

            @Expose()
            @Type(() => GameDto.Response.AllGames)
            @ApiProperty({
                description: "게임의 선택지 2개",
                example: [
                    {
                        gameId: 15,
                        title: "게임 선택 제목1",
                        description: "게임 선택 설명1",
                        selectedCount: 0,
                        selectedRatio: 0,
                    },
                    {
                        gameId: 16,
                        title: "게임 선택 제목2",
                        description: "게임 선택 설명2",
                        selectedCount: 0,
                        selectedRatio: 0,
                    },
                ],
            })
            game: GameDto.Response.AllGames[];

            @Expose()
            @ApiProperty({
                description: "게임을 만든 사람의 정보",
                example: "닉네임",
            })
            @Transform(({ obj }) => obj.writer.nickname)
            writer: string;

            @Expose()
            @ApiProperty({
                description: "해당 게임의 댓글",
                example: [
                    {
                        description: "내용",
                        writer: "test5",
                    },
                    {
                        description: "내용2",
                        writer: "test5",
                    },
                ],
            })
            @Type(() => CommentDto.Response.AllGames)
            comment: CommentDto.Response.AllGames[];
        }
    }
}
