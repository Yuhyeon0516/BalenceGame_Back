import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

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
    ],
    providers: [AuthService, JwtService],
    controllers: [AuthController],
})
export class AuthModule {}
