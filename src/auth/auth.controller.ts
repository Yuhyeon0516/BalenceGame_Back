import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDto } from './dtos/user.dto';

@ApiTags('사용자관련 API')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    @ApiBody({ type: UserDto.Request.Signup })
    @ApiOperation({ summary: '회원가입', description: '사용자 정보를 추가' })
    @ApiResponse({ status: 201, description: '회원가입 성공' })
    @ApiResponse({ status: 400, description: '회원가입 실패' })
    signup(@Body() body: UserDto.Request.Signup) {
        return this.authService.signup(
            body.email,
            body.password,
            body.nickname,
        );
    }
}
