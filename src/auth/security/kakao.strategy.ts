import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import { AuthService } from "../auth.service";
import { VerifiedCallback } from "passport-jwt";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
    constructor(
        public configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>("KAKAO_RESTAPI_KEY"),
            clientSecret: configService.get<string>("KAKAO_CLIENT_SECRET"),
            callbackURL: configService.get<string>("KAKAO_CALLBACK_URL"),
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifiedCallback,
    ) {
        const email = profile._json.kakao_account.email;

        if (!email) {
            throw new NotFoundException("카카오 이메일을 찾을 수 없습니다.");
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
