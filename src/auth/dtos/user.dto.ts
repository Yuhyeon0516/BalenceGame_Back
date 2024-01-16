import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export namespace UserDto {
    export namespace Request {
        export class Signup {
            @ApiProperty({ description: '이메일', example: 'test@test.com' })
            @IsEmail()
            email: string;

            @ApiProperty({ description: '비밀번호', example: '12345678' })
            @IsString()
            password: string;

            @ApiProperty({ description: '닉네임', example: 'test' })
            @IsString()
            nickname: string;
        }
    }
}
