import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

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
                example: "abcdefghijdhfjdsahfdsjkfhjskk",
            })
            @Expose()
            accessToken: string;
        }
    }
}
