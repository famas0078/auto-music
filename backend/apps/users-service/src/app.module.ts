import { Module } from '@nestjs/common';
import { UsersController } from './app.controller';
import { UsersService } from './app.service';
import { DatabaseService } from './database.service';

@Module({
  controllers: [UsersController],
  providers: [DatabaseService, UsersService],
})
export class UsersModule {}
