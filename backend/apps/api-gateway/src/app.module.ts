import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICES } from '@app/common';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { HomeService } from './home.service';
import { AuthService } from './auth.service';

const toNumber = (value: string | undefined, fallback: number) =>
  Number.parseInt(value || String(fallback), 10);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.catalog,
        transport: Transport.TCP,
        options: {
          host: process.env.CATALOG_SERVICE_HOST || '127.0.0.1',
          port: toNumber(process.env.CATALOG_SERVICE_PORT, 4001),
        },
      },
      {
        name: SERVICES.content,
        transport: Transport.TCP,
        options: {
          host: process.env.CONTENT_SERVICE_HOST || '127.0.0.1',
          port: toNumber(process.env.CONTENT_SERVICE_PORT, 4002),
        },
      },
      {
        name: SERVICES.users,
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST || '127.0.0.1',
          port: toNumber(process.env.USERS_SERVICE_PORT, 4003),
        },
      },
    ]),
  ],
  controllers: [AppController, AuthController],
  providers: [AuthService, HomeService],
})
export class AppModule {}

