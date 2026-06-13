<template>
  <article class="product-card" :class="cardClasses">
    <RouterLink class="product-card__link" :to="`/product/${product.slug}`">
      <div class="product-card__visual" :class="visualClass">
        <img v-if="product.imageSrc" :src="product.imageSrc" :alt="product.title" class="product-card__image" />
        <div v-else class="product-card__placeholder" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="rgba(111, 115, 128, 0.75)"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5 10.2V14.533C5.00423 15.4569 5.3754 16.3413 6.0318 16.9915C6.68821 17.6418 7.57608 18.0045 8.5 18H15.5C16.4239 18.0045 17.3118 17.6418 17.9682 16.9915C18.6246 16.3413 18.9958 15.4569 19 14.533V10.2C18.9958 9.27608 18.6246 8.39169 17.9682 7.74148C17.3118 7.09126 16.4239 6.72849 15.5 6.73301C15.0147 6.66864 14.6001 6.3515 14.411 5.90001C14.1009 5.34285 13.5126 4.99815 12.875 5.00001H11.125C10.4874 4.99815 9.89908 5.34285 9.589 5.90001C9.39986 6.3515 8.98526 6.66864 8.5 6.73301C7.57608 6.72849 6.68821 7.09126 6.0318 7.74148C5.3754 8.39169 5.00423 9.27608 5 10.2Z"
              stroke="rgba(111, 115, 128, 0.75)"
              stroke-width="0.768"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 14.533C10.8059 14.5214 9.84617 13.546 9.85405 12.3518C9.86193 11.1576 10.8344 10.1949 12.0286 10.1991C13.2228 10.2033 14.1885 11.1728 14.188 12.367C14.1851 12.9444 13.9529 13.4969 13.5426 13.9032C13.1323 14.3094 12.5774 14.5359 12 14.533Z"
              stroke="rgba(111, 115, 128, 0.75)"
              stroke-width="0.768"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div class="product-card__body">
        <span v-if="product.badge" class="product-card__badge">{{ product.badge }}</span>
        <h3>{{ product.title }}</h3>
        <p v-if="!compact" class="product-card__description">{{ product.shortDescription }}</p>
        <div class="product-card__price">
          <strong>{{ product.price }}</strong>
          <div v-if="product.oldPrice" class="product-card__old">
            <span>{{ product.oldPrice }}</span>
            <span>{{ product.discount }}</span>
          </div>
        </div>
      </div>
    </RouterLink>

    <div v-if="showActions" class="product-card__actions">
      <button
        class="product-card__action"
        :class="{ 'product-card__action--added': isAdded }"
        type="button"
        :disabled="isAdded"
        @click="$emit('add-to-cart', product)"
      >
        {{ isAdded ? 'Добавлено' : 'В корзину' }}
      </button>
    </div>
  </article>
</template>

<script>
import { RouterLink } from 'vue-router';
import { cartStore } from '../../stores/cart';

export default {
  name: 'ProductCard',
  components: {
    RouterLink,
  },
  emits: ['add-to-cart'],
  props: {
    compact: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      required: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    wide: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cardClasses() {
      return {
        'product-card--compact': this.compact,
        'product-card--wide': this.wide,
      };
    },
    isAdded() {
      return cartStore.hasProduct(this.product.id);
    },
    visualClass() {
      return `product-card__visual--${this.product.theme || 'default'}`;
    },
  },
};
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 18px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(90, 42, 96, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(90, 42, 96, 0.12);
}

.product-card__link {
  display: block;
  height: 100%;
}

.product-card__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 176px;
  padding: 18px;
  overflow: hidden;
  border-radius: 16px;
}

.product-card__visual--placeholder {
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.4), transparent 34%),
    linear-gradient(145deg, #ebedf2, #d6dae3);
}

.product-card__image {
  max-width: 100%;
  max-height: 142px;
  object-fit: contain;
}

.product-card__placeholder {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  border: 2px dashed rgba(111, 115, 128, 0.5);
  border-radius: 18px;
}

.product-card__body {
  padding-top: 14px;
}

.product-card__badge {
  display: inline-flex;
  margin-bottom: 8px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(227, 15, 63, 0.08);
  color: var(--brand-red);
  font-size: 11px;
  font-weight: 700;
}

.product-card h3 {
  margin: 0 0 8px;
  font-size: 15px;
  line-height: 1.35;
}

.product-card__description {
  margin: 0 0 14px;
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.5;
}

.product-card__price strong {
  display: block;
  margin-bottom: 4px;
  font-size: 20px;
}

.product-card__old {
  display: flex;
  gap: 8px;
  color: var(--text-soft);
  font-size: 12px;
}

.product-card__old span:first-child {
  text-decoration: line-through;
}

.product-card__old span:last-child {
  color: var(--brand-red);
}

.product-card__actions {
  margin-top: 16px;
}

.product-card__action {
  width: 100%;
  min-height: 42px;
  border: 1px solid transparent;
  border-radius: 22px;
  color: #fff;
  background: var(--brand-gradient);
  cursor: pointer;
}

.product-card__action--added {
  border-color: var(--brand-red);
  color: var(--brand-red);
  opacity: 1;
  background: transparent;
  cursor: default;
}

.product-card--compact .product-card__visual {
  min-height: 124px;
}

.product-card--compact .product-card__image {
  max-height: 98px;
}

.product-card--compact h3 {
  font-size: 13px;
}

.product-card--wide .product-card__visual {
  min-height: 250px;
}

.product-card--wide .product-card__image {
  max-height: 180px;
}
</style>
