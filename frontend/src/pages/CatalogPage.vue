<template>
  <div class="catalog-page">
    <section class="catalog-hero">
      <div class="container catalog-hero__grid">
        <div v-reveal>
          <span class="catalog-hero__eyebrow">Каталог</span>
          <h1>Подберите идеальный комплект автозвука под свой автомобиль</h1>
          <p>
            Акустика, сабвуферы, усилители и процессоры с удобной фильтрацией и быстрым переходом
            к оформлению.
          </p>
        </div>

        <div class="catalog-hero__meta" v-reveal="2">
          <div>
            <strong>{{ filteredProducts.length }}</strong>
            <span>товаров в выдаче</span>
          </div>
          <div>
            <strong>{{ brands.length }}</strong>
            <span>брендов</span>
          </div>
          <div>
            <strong>{{ inStockCount }}</strong>
            <span>в наличии</span>
          </div>
        </div>
      </div>
    </section>

    <section class="container catalog-layout">
      <aside class="catalog-sidebar panel" v-reveal>
        <div class="catalog-filter">
          <span class="catalog-filter__title">Категория</span>
          <button
            v-for="item in categories"
            :key="item.value"
            type="button"
            class="catalog-chip"
            :class="{ 'catalog-chip--active': filters.category === item.value }"
            @click="filters.category = item.value"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="catalog-filter">
          <span class="catalog-filter__title">Бренд</span>
          <button
            v-for="brand in brandOptions"
            :key="brand"
            type="button"
            class="catalog-chip"
            :class="{ 'catalog-chip--active': filters.brand === brand }"
            @click="filters.brand = brand"
          >
            {{ brand === 'all' ? 'Все бренды' : brand }}
          </button>
        </div>

        <div class="catalog-filter">
          <span class="catalog-filter__title">Поиск</span>
          <input v-model.trim="filters.search" type="text" placeholder="Например, сабвуфер" />
        </div>

        <div class="catalog-filter">
          <span class="catalog-filter__title">Наличие</span>
          <label class="catalog-switch">
            <input v-model="filters.inStockOnly" type="checkbox" />
            <span>Только в наличии</span>
          </label>
        </div>

        <div class="catalog-filter">
          <span class="catalog-filter__title">Сортировка</span>
          <select v-model="filters.sort">
            <option value="popular">Сначала популярные</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="title">По названию</option>
          </select>
        </div>
      </aside>

      <div class="catalog-content">
        <div class="catalog-toolbar" v-reveal>
          <p>{{ filteredProducts.length }} товаров</p>
          <button class="catalog-toolbar__reset" type="button" @click="resetFilters">Сбросить фильтры</button>
        </div>

        <div v-if="loading" class="catalog-empty panel" v-reveal>
          Загружаем каталог...
        </div>

        <div v-else-if="filteredProducts.length" class="catalog-grid">
          <ProductCard
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            v-reveal="(index % 4) + 1"
            :product="product"
            show-actions
            @add-to-cart="handleAddToCart"
          />
        </div>

        <div v-else class="catalog-empty panel" v-reveal>
          <h2>По этим параметрам ничего не найдено</h2>
          <p>Попробуйте убрать часть фильтров или посмотреть весь каталог целиком.</p>
        </div>

        <p v-if="feedbackMessage" class="catalog-feedback">{{ feedbackMessage }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import ProductCard from '../components/shared/ProductCard.vue';
import { api } from '../services/api';
import { enrichProducts } from '../data/media';
import { authStore } from '../stores/auth';
import { cartStore } from '../stores/cart';

const categoryLabels = {
  all: 'Все товары',
  subwoofers: 'Сабвуферы',
  speakers: 'Акустика',
  amplifiers: 'Усилители',
  processors: 'Процессоры',
};

export default {
  name: 'CatalogPage',
  components: {
    ProductCard,
  },
  data() {
    return {
      loading: true,
      feedbackMessage: '',
      products: [],
      brands: [],
      filters: {
        category: 'all',
        brand: 'all',
        search: '',
        inStockOnly: false,
        sort: 'popular',
      },
    };
  },
  computed: {
    categories() {
      return Object.entries(categoryLabels).map(([value, label]) => ({ value, label }));
    },
    brandOptions() {
      return ['all', ...this.brands];
    },
    filteredProducts() {
      const filtered = this.products
        .filter((product) => {
          if (this.filters.category !== 'all' && product.category !== this.filters.category) {
            return false;
          }

          if (this.filters.brand !== 'all' && product.brand !== this.filters.brand) {
            return false;
          }

          if (this.filters.inStockOnly && !product.inStock) {
            return false;
          }

          if (this.filters.search) {
            const query = this.filters.search.toLowerCase();
            const haystack = [product.title, product.brand, product.series, product.shortDescription]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            if (!haystack.includes(query)) {
              return false;
            }
          }

          return true;
        })
        .slice();

      if (this.filters.sort === 'price-asc') {
        filtered.sort((a, b) => a.priceValue - b.priceValue);
      } else if (this.filters.sort === 'price-desc') {
        filtered.sort((a, b) => b.priceValue - a.priceValue);
      } else if (this.filters.sort === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
      }

      return filtered;
    },
    inStockCount() {
      return this.products.filter((product) => product.inStock).length;
    },
  },
  async created() {
    try {
      const payload = await api.getProducts();
      this.products = enrichProducts(payload.products || []);
      this.brands = payload.brands || [];
    } catch (error) {
      this.feedbackMessage = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    resetFilters() {
      this.filters = {
        category: 'all',
        brand: 'all',
        search: '',
        inStockOnly: false,
        sort: 'popular',
      };
    },
    handleAddToCart(product) {
      if (!authStore.isAuthenticated) {
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.fullPath,
          },
        });
        return;
      }

      cartStore.add(product);
      this.feedbackMessage = `Товар «${product.title}» добавлен в корзину.`;
      window.setTimeout(() => {
        this.feedbackMessage = '';
      }, 2200);
    },
  },
};
</script>

<style scoped>
.catalog-page {
  padding-bottom: 8px;
}

.catalog-hero {
  padding: 60px 0 0;
}

.catalog-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 24px;
  align-items: end;
}

.catalog-hero__eyebrow {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--brand-red);
  background: #fff0f4;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.catalog-hero h1 {
  max-width: 760px;
  margin: 16px 0 14px;
  font-size: clamp(2.6rem, 5vw, 4.3rem);
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.catalog-hero p {
  max-width: 640px;
  margin: 0;
  color: var(--text-soft);
  line-height: 1.7;
}

.catalog-hero__meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.catalog-hero__meta div {
  padding: 18px;
  border-radius: 22px;
  background: #f6f2f7;
}

.catalog-hero__meta strong {
  display: block;
  margin-bottom: 8px;
  font-size: 28px;
}

.catalog-hero__meta span {
  color: var(--text-soft);
  font-size: 13px;
}

.catalog-layout {
  display: grid;
  grid-template-columns: 285px minmax(0, 1fr);
  gap: 26px;
  margin-top: 40px;
}

.catalog-sidebar {
  align-self: start;
  position: sticky;
  top: calc(var(--header-height) + 18px);
  max-height: calc(100vh - var(--header-height) - 36px);
  overflow: auto;
  padding: 24px;
}

.catalog-filter + .catalog-filter {
  margin-top: 24px;
}

.catalog-filter__title {
  display: block;
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 800;
}

.catalog-filter input[type='text'],
.catalog-filter select {
  width: 100%;
  height: 46px;
  padding: 0 16px;
  border: 1px solid #d7dce5;
  border-radius: 22px;
  background: #fff;
}

.catalog-chip {
  display: inline-flex;
  margin: 0 8px 8px 0;
  padding: 10px 14px;
  border: 1px solid #dbdee7;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
}

.catalog-chip--active {
  border-color: transparent;
  color: #fff;
  background: var(--brand-gradient);
}

.catalog-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4d5360;
}

.catalog-content {
  min-width: 0;
}

.catalog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.catalog-toolbar p {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.catalog-toolbar__reset {
  border: none;
  background: transparent;
  color: var(--brand-red);
  cursor: pointer;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.catalog-empty {
  padding: 36px;
  text-align: center;
}

.catalog-empty h2 {
  margin: 0 0 10px;
}

.catalog-empty p {
  margin: 0;
  color: var(--text-soft);
}

.catalog-feedback {
  margin: 18px 0 0;
  color: var(--brand-red);
  font-weight: 700;
}

@media (max-width: 1100px) {
  .catalog-hero__grid,
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .catalog-sidebar {
    position: static;
    max-height: none;
    overflow: visible;
  }

  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .catalog-hero {
    padding-top: 30px;
  }

  .catalog-hero__meta,
  .catalog-grid {
    grid-template-columns: 1fr;
  }

  .catalog-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
