import { Injectable } from '@nestjs/common';
import { catalogProducts, newProducts, weeklyProducts } from '@app/common';

@Injectable()
export class CatalogService {
  getNewProducts() {
    return newProducts;
  }

  getWeeklyProducts() {
    return weeklyProducts;
  }

  getProducts() {
    return {
      products: catalogProducts,
      categories: [
        { id: 'subwoofers', label: 'Сабвуферы' },
        { id: 'speakers', label: 'Акустика' },
        { id: 'amplifiers', label: 'Усилители' },
        { id: 'processors', label: 'Процессоры' },
      ],
      brands: [...new Set(catalogProducts.map((product) => product.brand))],
    };
  }

  getProductBySlug(slug: string) {
    return catalogProducts.find((product) => product.slug === slug) ?? null;
  }
}
