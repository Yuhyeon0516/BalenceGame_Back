import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsString } from "class-validator";
import { UserDto } from "src/auth/dtos/user.dto";

export namespace CommentDto {
    export namespace Request {
        export class WriteComment {
            @IsString()
            @ApiProperty({
                description: "댓글 내용",
                example: "재미없는 게임이네!!",
            })
            description: string;
        }
    }

    export namespace Response {
        export class AllGames {
            @Expose()
            @ApiProperty({
                description: "댓글 내용",
                example: "재미없는 게임이네!!",
            })
            description: string;

            @Expose()
            @ApiProperty({
                description: "작성자 닉네임",
                example: "Nick",
            })
            @Transform(({ obj }) => obj.writer.nickname)
            writer: string;
        }
    }
}
