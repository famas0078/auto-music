import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PATTERNS } from '@app/common';
import { CatalogService } from './app.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern(PATTERNS.catalog.newProducts)
  getNewProducts() {
    return this.catalogService.getNewProducts();
  }

  @MessagePattern(PATTERNS.catalog.weeklyProducts)
  getWeeklyProducts() {
    return this.catalogService.getWeeklyProducts();
  }

  @MessagePattern(PATTERNS.catalog.products)
  getProducts() {
    return this.catalogService.getProducts();
  }

  @MessagePattern(PATTERNS.catalog.productBySlug)
  getProductBySlug(@Payload() payload: { slug: string }) {
    return this.catalogService.getProductBySlug(payload.slug);
  }
}
