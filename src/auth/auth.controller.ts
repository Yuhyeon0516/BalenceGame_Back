import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserDto } from "./dtos/user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { Response } from "express";
import { NaverAuthGuard } from "src/guard/naver.auth.guard";
import { KakaoAuthGuard } from "src/guard/kakao.auth.guard";

@ApiTags("사용자관련 API")
@Controller("auth")
@Serialize(UserDto.Response.SignSuccess)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/signup")
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
    @ApiOperation({ summary: "로그인", description: "로그인 시도" })
    @ApiResponse({
        status: 201,
        description: "로그인 성공",
        type: UserDto.Response.SignSuccess,
    })
    @ApiResponse({ status: 400, description: "비밀번호가 틀렸을때" })
    @ApiResponse({ status: 401, description: "존재하지 않는 이메일" })
    signin(@Body() body: UserDto.Request.Signin) {
        console.log(body);
        return this.authService.signin(body.email, body.password);
    }

    @Get("/signout")
    @ApiOperation({ summary: "로그아웃", description: "로그아웃 시도" })
    @ApiResponse({
        status: 200,
        description: "로그아웃 성공",
    })
    @ApiResponse({ status: 400, description: "로그아웃 실패" })
    signout() {
        return;
    }

    @Get("/social/naver")
    @UseGuards(NaverAuthGuard)
    @ApiOperation({
        summary: "네이버 로그인",
        description: "네이버 로그인 또는 회원가입 시도",
    })
    @ApiQuery({ name: "code", description: "Naver OAuth를 통해 가져온 code" })
    @ApiQuery({ name: "state", description: "Naver OAuth를 통해 가져온 state" })
    @ApiResponse({
        status: 200,
        description: "로그인 성공",
    })
    signinNaver() {}

    @Get("/social/naver/cb")
    @UseGuards(NaverAuthGuard)
    naverCB(@Req() req: any, @Res() res: Response) {
        const user = req.user;
        res.redirect(
            `http://localhost:3000/auth/social/${user.uid}/${user.email}/${user.nickname}/${user.accessToken}`,
        );
        return res.status(200).send();
    }

    @Get("/social/kakao")
    @UseGuards(KakaoAuthGuard)
    @ApiOperation({
        summary: "카카오 로그인",
        description: "카카오 로그인 또는 회원가입 시도",
    })
    @ApiQuery({ name: "code", description: "Kakao OAuth를 통해 가져온 code" })
    @ApiResponse({
        status: 200,
        description: "로그인 성공",
    })
    async signinKakao() {}

    @Get("/social/kakao/cb")
    @UseGuards(KakaoAuthGuard)
    kakaoCB(@Req() req: any, @Res() res: Response) {
        const user = req.user;
        res.redirect(
            `http://localhost:3000/auth/social/${user.uid}/${user.email}/${user.nickname}/${user.accessToken}`,
        );
        return res.status(200).send();
    }
}
