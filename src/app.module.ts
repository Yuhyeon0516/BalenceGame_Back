import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./database/database.config";
import { AuthModule } from "./auth/auth.module";
import { APP_PIPE } from "@nestjs/core";
import { GamesModule } from "./games/games.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
        }),

        AuthModule,

        GamesModule,
    ],
    controllers: [],
    providers: [
        // {
        //     provide: APP_PIPE,
        //     useValue: new ValidationPipe({
        //         whitelist: true,
        //     }),
        // },
    ],
})
export class AppModule {}
