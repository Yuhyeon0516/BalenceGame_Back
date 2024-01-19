import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { CommentDto } from "src/games/dtos/comment.dto";
import { GamesDto } from "src/games/dtos/games.dto";

export namespace UserDto {
    export namespace Request {
        export class Signup {
            @ApiProperty({ description: "이메일", example: "test@test.com" })
            @IsEmail()
            email: string;

            @ApiProperty({ description: "비밀번호", example: "12345678" })
            @IsString()
            password: string;

            @ApiProperty({ description: "닉네임", example: "test" })
            @IsString()
            nickname: string;
        }

        export class Signin {
            @ApiProperty({ description: "이메일", example: "test@test.com" })
            @IsEmail()
            email: string;

            @ApiProperty({ description: "비밀번호", example: "12345678" })
            @IsString()
            password: string;
        }
    }

    export namespace Response {
        export class SignSuccess {
            @ApiProperty({ description: "유저 고유 ID", example: 1 })
            @Expose()
            uid: number;

            @ApiProperty({ description: "이메일", example: "test@test.com" })
            @Expose()
            email: string;

            @ApiProperty({ description: "닉네임", example: "test" })
            @Expose()
            nickname: string;

            @ApiProperty({
                description: "액세스 토큰",
                example: "{{token}}",
            })
            @Expose()
            accessToken: string;
        }

        export class AllGames {
            @Expose()
            @ApiProperty({
                description: "작성자 닉네임",
                example: "nick",
            })
            nickname: string;
        }

        export class MyInfo {
            @Expose()
            @ApiProperty({
                description: "작성했던 댓글",
                example: [
                    {
                        description: "내용321421",
                        createdAt: "2024-01-18T04:06:29.905Z",
                    },
                    {
                        description: "내용321",
                        createdAt: "2024-01-18T04:05:06.436Z",
                    },
                    {
                        description: "내용213",
                        createdAt: "2024-01-18T04:03:35.760Z",
                    },
                ],
            })
            @Type(() => CommentDto.Response.MyInfo)
            writedComments: CommentDto.Response.MyInfo[];

            @Expose()
            @ApiProperty({
                description: "만들었던 게임",
                example: [
                    {
                        title: "제목",
                        like: 1,
                        dislike: 3,
                        createdAt: "2024-01-18T03:30:57.209Z",
                        totalPlayer: 0,
                        game: [
                            {
                                title: "게임 선택 제목1",
                                description: "게임 선택 설명1",
                            },
                            {
                                title: "게임 선택 제목2",
                                description: "게임 선택 설명2",
                            },
                        ],
                    },
                    {
                        title: "제목2",
                        like: 0,
                        dislike: 0,
                        createdAt: "2024-01-18T03:30:57.209Z",
                        totalPlayer: 0,
                        game: [
                            {
                                title: "게임 선택 제목1",
                                description: "게임 선택 설명1",
                            },
                            {
                                title: "게임 선택 제목2",
                                description: "게임 선택 설명2",
                            },
                        ],
                    },
                ],
            })
            @Type(() => GamesDto.Response.MyInfo)
            createdGames: GamesDto.Response.MyInfo[];
        }
    }
}
