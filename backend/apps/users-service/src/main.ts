import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number.parseInt(process.env.SERVICE_PORT || '4003', 10),
    },
  });

  await app.listen();
}

bootstrap();
