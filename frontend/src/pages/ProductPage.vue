<template>
  <div class="product-page">
    <section class="container" v-if="product">
      <div class="breadcrumbs" v-reveal>
        <RouterLink to="/">Главная</RouterLink>
        <span>/</span>
        <RouterLink to="/catalog">Каталог</RouterLink>
        <span>/</span>
        <span>{{ product.title }}</span>
      </div>

      <div class="product-hero">
        <div class="product-hero__visual panel" v-reveal>
          <div class="product-hero__imagebox" :class="`product-hero__imagebox--${product.theme}`">
            <img v-if="product.imageSrc" :src="product.imageSrc" :alt="product.title" />
            <div v-else class="product-hero__placeholder" aria-hidden="true">
              <span>no image</span>
            </div>
          </div>
        </div>

        <div class="product-hero__content" v-reveal="2">
          <span v-if="product.badge" class="product-badge">{{ product.badge }}</span>
          <h1>{{ product.title }}</h1>
          <p class="product-hero__brand">{{ product.brand }} · {{ product.series }}</p>
          <p class="product-hero__description">{{ product.description }}</p>

          <div class="product-hero__price">
            <strong>{{ product.price }}</strong>
            <div v-if="product.oldPrice">
              <span>{{ product.oldPrice }}</span>
              <span>{{ product.discount }}</span>
            </div>
          </div>

          <div class="product-hero__status">
            <span :class="{ 'product-hero__status--off': !product.inStock }"></span>
            {{ product.inStock ? 'В наличии' : 'Под заказ' }}
          </div>

          <div class="product-hero__actions">
            <button
              class="base-button"
              :class="{ 'base-button--added': isAdded }"
              type="button"
              :disabled="isAdded"
              @click="handleAddToCart"
            >
              {{ authLabel }}
            </button>
            <RouterLink class="product-hero__back" to="/catalog">Вернуться в каталог</RouterLink>
          </div>

          <p v-if="feedbackMessage" class="product-hero__message">{{ feedbackMessage }}</p>
        </div>
      </div>

      <section class="product-details section-block">
        <div class="product-details__copy panel" v-reveal>
          <span class="section-eyebrow">Описание</span>
          <h2 class="section-title">Что важно знать о модели</h2>
          <p class="section-copy">{{ product.description }}</p>
        </div>

        <div class="product-specs panel" v-reveal="2">
          <span class="section-eyebrow">Характеристики</span>
          <div class="product-specs__grid">
            <div v-for="spec in product.specs" :key="spec.label" class="product-specs__row">
              <span>{{ spec.label }}</span>
              <strong>{{ spec.value }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section v-if="relatedProducts.length" class="section-block">
        <div class="product-related__head" v-reveal>
          <span class="section-eyebrow">Похожие товары</span>
          <h2 class="section-title">С этой моделью часто смотрят</h2>
        </div>

        <div class="product-related__grid">
          <ProductCard
            v-for="(item, index) in relatedProducts"
            :key="item.id"
            v-reveal="index + 1"
            :product="item"
            show-actions
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>
    </section>

    <section v-else class="container product-page__loading">
      <div class="panel product-page__loading-card" v-reveal>
        {{ loading ? 'Загружаем товар...' : 'Товар не найден.' }}
      </div>
    </section>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import ProductCard from '../components/shared/ProductCard.vue';
import { api } from '../services/api';
import { enrichProduct, enrichProducts } from '../data/media';
import { authStore } from '../stores/auth';
import { cartStore } from '../stores/cart';

export default {
  name: 'ProductPage',
  components: {
    ProductCard,
    RouterLink,
  },
  data() {
    return {
      loading: true,
      product: null,
      allProducts: [],
      feedbackMessage: '',
    };
  },
  computed: {
    authLabel() {
      if (!authStore.isAuthenticated) {
        return 'Войти и добавить в корзину';
      }

      return this.isAdded ? 'Добавлено' : 'Добавить в корзину';
    },
    isAdded() {
      return this.product ? cartStore.hasProduct(this.product.id) : false;
    },
    relatedProducts() {
      if (!this.product) {
        return [];
      }

      return this.allProducts
        .filter((item) => item.slug !== this.product.slug && item.category === this.product.category)
        .slice(0, 3);
    },
  },
  async created() {
    await this.loadPage();
  },
  watch: {
    '$route.params.slug': 'loadPage',
  },
  methods: {
    async loadPage() {
      this.loading = true;

      try {
        const [productPayload, catalogPayload] = await Promise.all([
          api.getProduct(this.$route.params.slug),
          api.getProducts(),
        ]);

        this.product = productPayload ? enrichProduct(productPayload) : null;
        this.allProducts = enrichProducts(catalogPayload.products || []);
      } catch (error) {
        this.product = null;
        this.allProducts = [];
      } finally {
        this.loading = false;
      }
    },
    handleAddToCart(product = this.product) {
      if (!authStore.isAuthenticated) {
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.fullPath,
          },
        });
        return;
      }

      if (cartStore.hasProduct(product.id)) {
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
.product-page {
  padding-top: 34px;
}

.breadcrumbs {
  display: flex;
  gap: 8px;
  color: var(--text-soft);
  font-size: 13px;
}

.product-hero {
  display: grid;
  grid-template-columns: minmax(0, 560px) minmax(0, 1fr);
  gap: 30px;
  margin-top: 22px;
}

.product-hero__visual {
  padding: 20px;
}

.product-hero__imagebox {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 30px;
  border-radius: 28px;
}

.product-hero__imagebox--placeholder {
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.4), transparent 34%),
    linear-gradient(145deg, #eef1f6, #d8dde7);
}

.product-hero__imagebox img {
  max-width: 100%;
  max-height: 420px;
  object-fit: contain;
}

.product-hero__placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  border: 2px dashed rgba(111, 115, 128, 0.45);
  border-radius: 24px;
  color: rgba(111, 115, 128, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.product-badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--brand-red);
  background: #fff0f4;
  font-size: 12px;
  font-weight: 800;
}

.product-hero__content h1 {
  margin: 18px 0 10px;
  font-size: clamp(2.3rem, 4vw, 3.8rem);
  line-height: 0.98;
}

.product-hero__brand {
  margin: 0 0 18px;
  color: var(--text-soft);
}

.product-hero__description {
  margin: 0 0 28px;
  max-width: 560px;
  color: #515868;
  line-height: 1.72;
}

.product-hero__price strong {
  display: block;
  margin-bottom: 8px;
  font-size: 42px;
  line-height: 1;
}

.product-hero__price div {
  display: flex;
  gap: 10px;
  align-items: center;
}

.product-hero__price div span:first-child {
  color: var(--text-soft);
  text-decoration: line-through;
}

.product-hero__price div span:last-child {
  color: var(--brand-red);
  font-weight: 800;
}

.product-hero__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  color: #2f5d3a;
  font-weight: 700;
}

.product-hero__status span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4cb868;
}

.product-hero__status--off {
  background: #f2a341 !important;
}

.product-hero__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
}

.product-hero__back {
  color: var(--brand-red);
  font-weight: 700;
}

.base-button--added {
  border: 1px solid var(--brand-red);
  color: var(--brand-red);
  opacity: 1;
  background: transparent;
  box-shadow: none;
  cursor: default;
}

.product-hero__message {
  margin: 18px 0 0;
  color: var(--brand-red);
  font-weight: 700;
}

.product-details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  gap: 24px;
}

.product-details__copy,
.product-specs {
  padding: 28px;
}

.product-specs__grid {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.product-specs__row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(98, 38, 84, 0.08);
}

.product-specs__row span {
  color: var(--text-soft);
}

.product-related__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.product-page__loading {
  padding-top: 40px;
}

.product-page__loading-card {
  padding: 46px;
  text-align: center;
}

@media (max-width: 1100px) {
  .product-hero,
  .product-details,
  .product-related__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .product-page {
    padding-top: 18px;
  }

  .product-hero__imagebox {
    min-height: 320px;
  }

  .product-hero__actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-hero__actions .base-button {
    width: 100%;
  }
}
</style>
