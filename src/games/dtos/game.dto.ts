import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export namespace GameDto {
    export namespace Request {
        export class Create {
            @IsString()
            @ApiProperty({
                description: "게임 선택 제목",
                example: "게임 선택 제목",
            })
            title: string;

            @IsString()
            @ApiProperty({
                description: "게임 선택 설명",
                example: "게임 선택 설명",
            })
            description: string;
        }
    }

    export namespace Response {}
}
