import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsString,
    Length,
} from "class-validator";
import { GameDto } from "./game.dto";
import { ApiProperty } from "@nestjs/swagger";

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

    export namespace Response {}
}
