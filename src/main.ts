import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const apiDocsConfig = new DocumentBuilder()
        .setTitle('API Docs')
        .setDescription('This is api docs')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, apiDocsConfig);
    SwaggerModule.setup('api-docs', app, document);
    await app.listen(8080);
}

bootstrap();
