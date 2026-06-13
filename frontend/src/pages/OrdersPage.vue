<template>
  <div class="orders-page">
    <section class="container">
      <div class="orders-page__head" v-reveal>
        <span class="section-eyebrow">История заказов</span>
        <h1 class="section-title">Все ваши оформления в одном месте</h1>
        <p class="section-copy">Здесь можно посмотреть состав заказов, дату оформления и итоговую сумму.</p>
      </div>

      <div v-if="loading" class="orders-empty panel" v-reveal>
        <h2>Загружаем заказы</h2>
        <p>Подтягиваем историю с сервера.</p>
      </div>

      <div v-else-if="error" class="orders-empty panel" v-reveal>
        <h2>Не удалось загрузить историю</h2>
        <p>{{ error }}</p>
        <button class="base-button" type="button" @click="loadOrders">Повторить</button>
      </div>

      <div v-else-if="orders.length" class="orders-list">
        <article v-for="(order, index) in orders" :key="order.id" class="order-card panel" v-reveal="(index % 3) + 1">
          <div class="order-card__top">
            <div>
              <span class="order-card__label">Заказ</span>
              <h2>{{ order.id }}</h2>
            </div>
            <div class="order-card__meta">
              <span class="order-card__status">{{ order.status }}</span>
              <strong>{{ formatCurrency(order.total) }}</strong>
            </div>
          </div>

          <div class="order-card__details">
            <div>
              <small>Дата</small>
              <span>{{ formatDate(order.createdAt) }}</span>
            </div>
            <div>
              <small>Получатель</small>
              <span>{{ order.customer.name }}</span>
            </div>
            <div>
              <small>Телефон</small>
              <span>{{ order.customer.phone || 'Не указан' }}</span>
            </div>
            <div>
              <small>Email</small>
              <span>{{ order.customer.email }}</span>
            </div>
          </div>

          <div class="order-card__items">
            <div v-for="item in order.items" :key="`${order.id}-${item.id}`" class="order-card__item">
              <RouterLink :to="`/product/${item.slug}`">{{ item.title }}</RouterLink>
              <span>{{ item.quantity }} × {{ formatCurrency(item.priceValue) }}</span>
            </div>
          </div>

          <p v-if="order.note" class="order-card__note">Комментарий: {{ order.note }}</p>
        </article>
      </div>

      <div v-else class="orders-empty panel" v-reveal>
        <h2>История заказов пока пустая</h2>
        <p>Как только вы оформите первый заказ, он появится здесь.</p>
        <RouterLink class="base-button" to="/catalog">Перейти в каталог</RouterLink>
      </div>
    </section>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { ordersStore } from '../stores/orders';

export default {
  name: 'OrdersPage',
  components: {
    RouterLink,
  },
  computed: {
    error() {
      return ordersStore.state.error;
    },
    loading() {
      return ordersStore.state.loading;
    },
    orders() {
      return ordersStore.state.items;
    },
  },
  created() {
    this.loadOrders();
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
    },
    formatDate(value) {
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(value));
    },
    async loadOrders() {
      try {
        await ordersStore.fetch();
      } catch (error) {
        if (error.message === 'Сессия недействительна, войдите снова') {
          this.$router.replace({
            path: '/login',
            query: {
              redirect: this.$route.fullPath,
            },
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.orders-page {
  padding-top: 34px;
}

.orders-list {
  display: grid;
  gap: 18px;
  margin-top: 30px;
}

.order-card {
  padding: 24px;
}

.order-card__top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}

.order-card__label {
  display: inline-block;
  margin-bottom: 10px;
  color: var(--brand-red);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.order-card h2 {
  margin: 0;
  font-size: 26px;
}

.order-card__meta {
  display: grid;
  justify-items: end;
  gap: 10px;
}

.order-card__status {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--brand-red);
  background: #fff0f4;
  font-size: 12px;
  font-weight: 700;
}

.order-card__meta strong {
  font-size: 24px;
}

.order-card__details {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.order-card__details small {
  display: block;
  margin-bottom: 8px;
  color: var(--text-soft);
}

.order-card__items {
  display: grid;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(98, 38, 84, 0.08);
}

.order-card__item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.order-card__item a {
  font-weight: 700;
}

.order-card__item span {
  color: var(--text-soft);
}

.order-card__note {
  margin: 18px 0 0;
  color: var(--text-soft);
}

.orders-empty {
  display: grid;
  justify-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 48px 20px;
  text-align: center;
}

.orders-empty h2,
.orders-empty p {
  margin: 0;
}

.orders-empty p {
  color: var(--text-soft);
}

@media (max-width: 900px) {
  .order-card__details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .orders-page {
    padding-top: 18px;
  }

  .order-card__top,
  .order-card__item {
    display: grid;
    grid-template-columns: 1fr;
  }

  .order-card__meta {
    justify-items: start;
  }

  .order-card__details {
    grid-template-columns: 1fr;
  }
}
</style>
