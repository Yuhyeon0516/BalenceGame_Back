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
            })
            @Type(() => CommentDto.Response.MyInfo)
            writedComments: CommentDto.Response.MyInfo[];

            @Expose()
            @ApiProperty({
                description: "만들었던 게임",
            })
            @Type(() => GamesDto.Response.MyInfo)
            createdGames: GamesDto.Response.MyInfo[];
        }
    }
}
