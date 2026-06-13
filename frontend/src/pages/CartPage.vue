<template>
  <div class="cart-page">
    <section class="container">
      <div class="cart-page__head" v-reveal>
        <span class="section-eyebrow">Корзина</span>
        <h1 class="section-title">Ваш заказ почти готов</h1>
        <p class="section-copy">Проверьте состав корзины и оформите доставку или установку.</p>
      </div>

      <div v-if="items.length" class="cart-layout">
        <div class="cart-items">
          <article v-for="(item, index) in items" :key="item.id" class="cart-item panel" v-reveal="(index % 3) + 1">
            <RouterLink class="cart-item__visual" :to="`/product/${item.slug}`">
              <img v-if="item.imageSrc" :src="item.imageSrc" :alt="item.title" />
              <span v-else>no image</span>
            </RouterLink>

            <div class="cart-item__content">
              <RouterLink :to="`/product/${item.slug}`" class="cart-item__title">{{ item.title }}</RouterLink>
              <p class="cart-item__price">{{ item.price }}</p>
            </div>

            <div class="cart-item__controls">
              <div class="cart-qty">
                <button type="button" @click="changeQuantity(item, item.quantity - 1)">-</button>
                <span>{{ item.quantity }}</span>
                <button type="button" @click="changeQuantity(item, item.quantity + 1)">+</button>
              </div>

              <strong>{{ formatCurrency(item.priceValue * item.quantity) }}</strong>
              <button class="cart-item__remove" type="button" @click="removeItem(item.id)">Удалить</button>
            </div>
          </article>
        </div>

        <aside class="cart-summary panel" v-reveal="2">
          <span class="cart-summary__eyebrow">Итого</span>
          <div class="cart-summary__row">
            <span>Товаров</span>
            <strong>{{ count }}</strong>
          </div>
          <div class="cart-summary__row">
            <span>Сумма заказа</span>
            <strong>{{ formatCurrency(total) }}</strong>
          </div>
          <div class="cart-summary__row">
            <span>Доставка</span>
            <strong>Уточняется</strong>
          </div>

          <button class="base-button cart-summary__button" type="button" @click="openCheckout">
            Перейти к оформлению
          </button>
          <RouterLink class="cart-summary__link" to="/catalog">Продолжить покупки</RouterLink>
        </aside>
      </div>

      <div v-else class="cart-empty panel" v-reveal>
        <h2>Корзина пока пустая</h2>
        <p>Добавьте товары из каталога, и здесь сразу появится ваш заказ.</p>
        <RouterLink class="base-button" to="/catalog">Перейти в каталог</RouterLink>
      </div>
    </section>

    <CheckoutModal
      :open="checkoutOpen"
      :total="total"
      :item-count="count"
      :submitting="checkoutSubmitting"
      :message="checkoutMessage"
      :initial-values="checkoutInitialValues"
      @close="closeCheckout"
      @submit="submitCheckout"
    />
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import CheckoutModal from '../components/shared/CheckoutModal.vue';
import { authStore } from '../stores/auth';
import { cartStore } from '../stores/cart';
import { ordersStore } from '../stores/orders';

export default {
  name: 'CartPage',
  components: {
    CheckoutModal,
    RouterLink,
  },
  data() {
    return {
      checkoutSubmitting: false,
      checkoutMessage: '',
    };
  },
  computed: {
    checkoutInitialValues() {
      const user = authStore.state.user || {};
      return {
        email: user.email || '',
        name: user.name || '',
        phone: user.phone || '',
      };
    },
    items() {
      return cartStore.state.items;
    },
    total() {
      return cartStore.total;
    },
    count() {
      return cartStore.count;
    },
    checkoutOpen() {
      return cartStore.state.checkoutOpen;
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
    },
    changeQuantity(item, nextQuantity) {
      if (nextQuantity < 1) {
        cartStore.remove(item.id);
        return;
      }

      cartStore.updateQuantity(item.id, nextQuantity);
    },
    removeItem(productId) {
      cartStore.remove(productId);
    },
    openCheckout() {
      cartStore.openCheckout();
      this.checkoutMessage = '';
    },
    closeCheckout() {
      cartStore.closeCheckout();
      this.checkoutMessage = '';
      this.checkoutSubmitting = false;
    },
    async submitCheckout(payload) {
      this.checkoutSubmitting = true;
      this.checkoutMessage = '';

      try {
        const response = await ordersStore.create({
          customer: {
            email: payload.email,
            name: payload.name,
            phone: payload.phone,
          },
          items: this.items.map((item) => ({ ...item })),
          note: payload.comment,
          total: this.total,
        });

        this.checkoutSubmitting = false;
        this.checkoutMessage = response.message;
        cartStore.clear();

        window.setTimeout(() => {
          this.closeCheckout();
          this.$router.push('/orders');
        }, 900);
      } catch (error) {
        this.checkoutSubmitting = false;
        this.checkoutMessage = error.message;
      }
    },
  },
};
</script>

<style scoped>
.cart-page {
  padding-top: 34px;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 24px;
  margin-top: 34px;
}

.cart-items {
  display: grid;
  gap: 16px;
}

.cart-item {
  display: grid;
  grid-template-columns: 138px minmax(0, 1fr) 210px;
  gap: 18px;
  align-items: center;
  padding: 16px;
}

.cart-item__visual {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 126px;
  border-radius: 22px;
}

.cart-item__visual img {
  max-width: 100%;
  max-height: 96px;
  object-fit: contain;
}

.cart-item__visual span {
  color: rgba(255, 255, 255, 0.75);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cart-item__title {
  display: block;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 800;
}

.cart-item__price {
  margin: 0;
  color: var(--text-soft);
}

.cart-item__controls {
  display: grid;
  justify-items: end;
  gap: 14px;
}

.cart-qty {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f4f1f6;
}

.cart-qty button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}

.cart-item__remove {
  border: none;
  background: transparent;
  color: var(--brand-red);
  cursor: pointer;
}

.cart-summary {
  align-self: start;
  padding: 26px;
}

.cart-summary__eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  color: var(--brand-red);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.cart-summary__row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(98, 38, 84, 0.08);
}

.cart-summary__button {
  width: 100%;
  margin-top: 24px;
}

.cart-summary__link {
  display: inline-block;
  margin-top: 16px;
  color: var(--brand-red);
  font-weight: 700;
}

.cart-empty {
  display: grid;
  justify-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 48px 20px;
  text-align: center;
}

.cart-empty h2,
.cart-empty p {
  margin: 0;
}

.cart-empty p {
  color: var(--text-soft);
}

@media (max-width: 1100px) {
  .cart-layout,
  .cart-item {
    grid-template-columns: 1fr;
  }

  .cart-item__controls {
    justify-items: start;
  }
}

@media (max-width: 720px) {
  .cart-page {
    padding-top: 18px;
  }
}
</style>
