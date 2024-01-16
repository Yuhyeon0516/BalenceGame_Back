import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserDto } from "./dtos/user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { AuthGuard } from "src/guard/auth.guard";

@ApiTags("사용자관련 API")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/signup")
    @Serialize(UserDto.Response.SignSuccess)
    @ApiBody({ type: UserDto.Request.Signup })
    @ApiOperation({ summary: "회원가입", description: "사용자 정보를 추가" })
    @ApiResponse({
        status: 201,
        description: "회원가입 성공",
        type: UserDto.Response.SignSuccess,
    })
    @ApiResponse({
        status: 400,
        description: "이미 가입된 이메일 또는 존재하는 닉네임",
    })
    signup(@Body() body: UserDto.Request.Signup) {
        return this.authService.signup(
            body.email,
            body.password,
            body.nickname,
        );
    }

    @Post("/signin")
    @Serialize(UserDto.Response.SignSuccess)
    @ApiOperation({ summary: "로그인", description: "로그인 시도" })
    @ApiResponse({
        status: 201,
        description: "로그인 성공",
        type: UserDto.Response.SignSuccess,
    })
    @ApiResponse({ status: 400, description: "비밀번호가 틀렸을때" })
    @ApiResponse({ status: 401, description: "존재하지 않는 이메일" })
    signin(@Body() body: UserDto.Request.Signin) {
        return this.authService.signin(body.email, body.password);
    }
}
