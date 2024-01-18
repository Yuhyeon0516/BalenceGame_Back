import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { VerifiedCallback } from "passport-jwt";
import { Strategy } from "passport-naver-v2";
import { AuthService } from "../auth.service";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
    constructor(
        public configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>("NAVER_CLIENT_ID"),
            clientSecret: configService.get<string>("NAVER_CLIENT_SECRET"),
            callbackURL: configService.get<string>("NAVER_CALLBACK_URL"),
            passReqToCallback: true,
        });
    }

    async validate(
        req: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
    ) {
        const { email } = profile;

        if (!email) {
            throw new NotFoundException("네이버 이메일을 찾을 수 없습니다.");
        }

        const user = await this.authService.findByEmail(email);

        // user 가 없을때 회원가입
        if (!user) {
            return await this.authService.createSocialUser(email);
        }

        // user 가 있을때 로그인

        return this.authService.generateToken(user);
    }
}
