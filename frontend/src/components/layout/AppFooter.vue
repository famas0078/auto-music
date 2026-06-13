<template>
  <footer id="footer" class="site-footer">
    <div class="container site-footer__grid">
      <div>
        <p class="site-footer__heading">Как купить</p>
        <RouterLink :to="{ path: '/', hash: '#hero' }">О проекте и доставке</RouterLink>
        <RouterLink to="/catalog">Каталог</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#reviews' }">Отзывы</RouterLink>
      </div>
      <div>
        <p class="site-footer__heading">Партнёрам</p>
        <RouterLink :to="{ path: '/', hash: '#weekly' }">Поставщикам и производителям</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#newsletter' }">Спецпредложения</RouterLink>
      </div>
      <div>
        <p class="site-footer__heading">Контакты</p>
        <a href="mailto:hello@automusic.local">hello@automusic.local</a>
        <a href="tel:+74951234567">+7 (495) 123-45-67</a>
        <a href="https://maps.google.com" target="_blank" rel="noreferrer">г. Москва, ул. Музыки, 24</a>
      </div>
    </div>
    <div class="container site-footer__bottom">
      <span>Все права защищены</span>
      <span>AutoMusic</span>
      <span>Политика конфиденциальности</span>
    </div>
  </footer>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  name: 'AppFooter',
  components: {
    RouterLink,
  },
};
</script>

<style scoped>
.site-footer {
  margin-top: 72px;
  padding: 42px 0 28px;
  background: #f0eef3;
  border-top: 1px solid rgba(104, 37, 110, 0.08);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.site-footer__heading {
  margin: 0 0 16px;
  font-weight: 800;
}

.site-footer a {
  display: block;
  margin-bottom: 10px;
  color: var(--text-soft);
}

.site-footer__bottom {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid rgba(104, 37, 110, 0.08);
  color: var(--text-soft);
  font-size: 0.92rem;
}

@media (max-width: 768px) {
  .site-footer__grid,
  .site-footer__bottom {
    display: grid;
    grid-template-columns: 1fr;
  }

  .site-footer__bottom {
    gap: 8px;
  }
}
</style>
