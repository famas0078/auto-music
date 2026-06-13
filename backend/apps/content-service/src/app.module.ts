import { Module } from '@nestjs/common';
import { ContentController } from './app.controller';
import { ContentService } from './app.service';

@Module({
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}

