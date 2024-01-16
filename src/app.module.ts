import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/database.config';
import { AuthModule } from './auth/auth.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env`,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
        }),
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor(private configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*');

        consumer
            .apply(
                session({
                    secret: this.configService.get<string>('COOKIE_SECRET'),
                    resave: false,
                    saveUninitialized: false,
                }),
            )
            .forRoutes('*');
    }
}
