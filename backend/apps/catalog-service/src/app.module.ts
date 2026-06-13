import { Module } from '@nestjs/common';
import { CatalogController } from './app.controller';
import { CatalogService } from './app.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}

