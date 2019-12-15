import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

const logger = new Logger();

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: 8585,
        },
    });

    await app.listen(() => {
        logger.log('Video upload service is listening...');
    });
}

bootstrap();
