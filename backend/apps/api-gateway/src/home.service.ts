import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CatalogPayload, HomePayload, PATTERNS, Product, SERVICES } from '@app/common';

@Injectable()
export class HomeService {
  constructor(
    @Inject(SERVICES.catalog) private readonly catalogClient: ClientProxy,
    @Inject(SERVICES.content) private readonly contentClient: ClientProxy,
  ) {}

  async getHome(): Promise<HomePayload> {
    const [guarantees, newProducts, weeklyProducts, testimonials] = await Promise.all([
      firstValueFrom(this.contentClient.send(PATTERNS.content.guarantees, {})),
      firstValueFrom(this.catalogClient.send(PATTERNS.catalog.newProducts, {})),
      firstValueFrom(this.catalogClient.send(PATTERNS.catalog.weeklyProducts, {})),
      firstValueFrom(this.contentClient.send(PATTERNS.content.testimonials, {})),
    ]);

    return {
      guarantees,
      newProducts,
      weeklyProducts,
      testimonials,
    };
  }

  subscribe(email: string) {
    return firstValueFrom(this.contentClient.send(PATTERNS.content.newsletter, { email }));
  }

  getProducts(): Promise<CatalogPayload> {
    return firstValueFrom(this.catalogClient.send(PATTERNS.catalog.products, {}));
  }

  getProductBySlug(slug: string): Promise<Product | null> {
    return firstValueFrom(this.catalogClient.send(PATTERNS.catalog.productBySlug, { slug }));
  }
}
