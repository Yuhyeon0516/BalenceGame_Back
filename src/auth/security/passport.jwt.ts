import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

interface PayLoad {
    id: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        public configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("JWT_SECRET"),
        });
    }

    async validate(payload: PayLoad, done: VerifiedCallback) {
        const { id } = payload;
        const user = await this.authService.findById(id);

        if (!user) {
            throw new UnauthorizedException("회원 정보가 존재하지 않습니다.");
        }

        return done(null, user);
    }
}
