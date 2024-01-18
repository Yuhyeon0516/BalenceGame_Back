import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./security/passport.jwt";
import { NaverStrategy } from "./security/naver.strategy";
import { KakaoStrategy } from "./security/kakao.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                return {
                    secret: config.get<string>("JWT_SECRET"),
                    signOptions: { expiresIn: "1d" },
                };
            },
        }),
        PassportModule,
    ],
    providers: [
        AuthService,
        JwtService,
        JwtStrategy,
        NaverStrategy,
        KakaoStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
