<template>
  <header class="site-header" :class="{ 'site-header--scrolled': isScrolled }">
    <div class="container site-header__inner">
      <RouterLink to="/" class="brand-mark">
        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16.5" cy="16.5" r="16.5" fill="url(#paint0_linear_2048_680)"/>
          <rect x="5.65625" y="11.5145" width="1.5483" height="9.97104" rx="0.619319" fill="white"/>
          <rect x="8.20508" y="13.0628" width="1.42443" height="6.87444" rx="0.619319" fill="white"/>
          <rect x="10.6289" y="10.121" width="1.42443" height="12.758" rx="0.619319" fill="white"/>
          <rect x="13.0527" y="6.38818" width="1.5483" height="20.2237" rx="0.619319" fill="white"/>
          <rect x="15.6016" y="4.00659" width="1.5483" height="24.9868" rx="0.619319" fill="white"/>
          <rect x="18.1504" y="8.13919" width="1.5483" height="16.7216" rx="0.619319" fill="white"/>
          <rect x="20.6982" y="10.9881" width="1.5483" height="11.0239" rx="0.619319" fill="white"/>
          <rect x="23.2461" y="12.4567" width="1.5483" height="8.08656" rx="0.619319" fill="white"/>
          <rect x="25.7949" y="10.9532" width="1.5483" height="11.0937" rx="0.619319" fill="white"/>
          <defs>
            <linearGradient id="paint0_linear_2048_680" x1="33" y1="33" x2="32.8374" y2="-0.161032" gradientUnits="userSpaceOnUse">
              <stop stop-color="#CF0A2C"/>
              <stop offset="1" stop-color="#682666"/>
            </linearGradient>
          </defs>
        </svg>

        <span class="brand-mark__text">Автозвук</span>
      </RouterLink>

      <nav class="site-header__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="site-header__nav-link"
          :class="{ 'site-header__nav-link--active': isNavItemActive(item) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="site-header__actions">
        <RouterLink class="icon-link" to="/catalog" aria-label="Каталог">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <rect x="2" y="2" width="5" height="5" rx="1.2" fill="currentColor" />
            <rect x="11" y="2" width="5" height="5" rx="1.2" fill="currentColor" />
            <rect x="2" y="11" width="5" height="5" rx="1.2" fill="currentColor" />
            <rect x="11" y="11" width="5" height="5" rx="1.2" fill="currentColor" />
          </svg>
        </RouterLink>

        <RouterLink class="icon-link icon-link--cart" to="/cart" aria-label="Корзина">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M2.5 4H4.3C5.1 4 5.8 4.6 5.9 5.4L6.3 8H18.4C19.8 8 20.8 9.3 20.5 10.7L19.6 14.4C19.3 15.5 18.3 16.3 17.1 16.3H8.4C7.2 16.3 6.2 15.4 6 14.2L4.8 6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="9" cy="19.2" r="1.6" fill="currentColor" />
            <circle cx="16.8" cy="19.2" r="1.6" fill="currentColor" />
          </svg>
          <span v-if="cartCount" class="icon-link__badge">{{ cartCount }}</span>
        </RouterLink>

        <RouterLink v-if="!isAuthenticated" class="icon-link icon-link--profile" to="/login" aria-label="Войти">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M5 19C5 16.5 7 14.5 9.5 14.5H14.5C17 14.5 19 16.5 19 19V20H5V19Z" fill="currentColor" />
          </svg>
        </RouterLink>

        <div
          v-else
          ref="profileMenu"
          class="profile-menu"
          @mouseenter="isProfileOpen = true"
          @mouseleave="isProfileOpen = false"
        >
          <button class="icon-link icon-link--profile" type="button" aria-label="Профиль" @click="toggleProfileMenu">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="currentColor" />
              <path d="M5 19C5 16.5 7 14.5 9.5 14.5H14.5C17 14.5 19 16.5 19 19V20H5V19Z" fill="currentColor" />
            </svg>
          </button>

          <Transition name="menu-fade">
            <div v-if="isProfileOpen" class="profile-menu__dropdown">
              <RouterLink class="profile-menu__item" to="/orders" @click="closeProfileMenu">История заказов</RouterLink>
              <button class="profile-menu__item profile-menu__item--danger" type="button" @click="requestLogout">
                Выход
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="menu-fade">
        <div v-if="logoutConfirmOpen" class="logout-modal" @click.self="closeLogoutModal">
          <div class="logout-modal__panel">
            <h2>Выйти из аккаунта?</h2>
            <p>История заказов сохранится, но для новых оформлений понадобится снова войти.</p>
            <div class="logout-modal__actions">
              <button class="logout-modal__ghost" type="button" @click="closeLogoutModal">Нет</button>
              <button class="base-button" type="button" @click="logout">Да, выйти</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router';
import { authStore } from '../../stores/auth';
import { cartStore } from '../../stores/cart';
import { ordersStore } from '../../stores/orders';

export default {
  name: 'AppHeader',
  components: {
    RouterLink,
  },
  data() {
    return {
      activeNavKey: 'home',
      isProfileOpen: false,
      isScrolled: false,
      logoutConfirmOpen: false,
      navItems: [
        { key: 'home', label: 'Главная', to: { path: '/', hash: '#hero' }, sectionId: 'hero' },
        { key: 'catalog', label: 'Каталог', to: '/catalog' },
        { key: 'new-arrivals', label: 'Новинки', to: { path: '/', hash: '#new-arrivals' }, sectionId: 'new-arrivals' },
        { key: 'reviews', label: 'Отзывы', to: { path: '/', hash: '#reviews' }, sectionId: 'reviews' },
        { key: 'contacts', label: 'Контакты', to: { path: '/', hash: '#footer' }, sectionId: 'footer' },
      ],
    };
  },
  computed: {
    cartCount() {
      return cartStore.count;
    },
    isAuthenticated() {
      return authStore.isAuthenticated;
    },
  },
  watch: {
    '$route.fullPath'() {
      this.closeProfileMenu();
      this.$nextTick(() => {
        this.updateActiveNavState();
      });
    },
  },
  mounted() {
    this.updateActiveNavState();
    window.addEventListener('click', this.handleOutsideClick);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleScroll, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  },
  methods: {
    closeLogoutModal() {
      this.logoutConfirmOpen = false;
    },
    closeProfileMenu() {
      this.isProfileOpen = false;
    },
    handleOutsideClick(event) {
      if (!this.$refs.profileMenu) {
        return;
      }

      if (!this.$refs.profileMenu.contains(event.target)) {
        this.closeProfileMenu();
      }
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 12;
      this.updateActiveSectionFromScroll();
    },
    isNavItemActive(item) {
      return this.activeNavKey === item.key;
    },
    logout() {
      authStore.logout();
      ordersStore.reset();
      this.closeLogoutModal();
      this.closeProfileMenu();
      this.$router.push('/');
    },
    requestLogout() {
      this.closeProfileMenu();
      this.logoutConfirmOpen = true;
    },
    toggleProfileMenu() {
      this.isProfileOpen = !this.isProfileOpen;
    },
    updateActiveNavState() {
      this.handleScroll();

      if (this.$route.path === '/catalog' || this.$route.path.startsWith('/product/')) {
        this.activeNavKey = 'catalog';
        return;
      }

      if (this.$route.path === '/orders') {
        this.activeNavKey = 'home';
        return;
      }

      if (this.$route.path !== '/') {
        return;
      }

      this.updateActiveSectionFromScroll();
    },
    updateActiveSectionFromScroll() {
      if (this.$route.path !== '/') {
        return;
      }

      const threshold = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 108) + 80;
      const sectionItems = this.navItems.filter((item) => item.sectionId);
      let currentKey = 'home';

      for (const item of sectionItems) {
        const section = document.getElementById(item.sectionId);
        if (!section) {
          continue;
        }

        const rect = section.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentKey = item.key;
        }
      }

      this.activeNavKey = currentKey;
    },
  },
};
</script>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  transition:
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.site-header--scrolled {
  box-shadow: 0 12px 28px rgba(80, 28, 75, 0.12);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--header-height);
  gap: 24px;
}

.brand-mark {
  font-family: 'Gilroy', sans-serif;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  line-height: 100%;
  font-weight: 400;
  gap: 4px;
}

.brand-mark__icon {
  display: inline-grid;
  grid-auto-flow: column;
  align-items: end;
  gap: 3px;
  width: 34px;
  height: 34px;
  padding: 7px;
  border-radius: 12px;
  background: var(--brand-gradient);
}

.brand-mark__icon span {
  display: block;
  border-radius: 999px;
  background: #fff;
}

.brand-mark__icon span:nth-child(1) {
  height: 12px;
}

.brand-mark__icon span:nth-child(2) {
  height: 20px;
}

.brand-mark__icon span:nth-child(3) {
  height: 15px;
}

.brand-mark__text {
  font-size: 1rem;
}

.site-header__nav {
  display: inline-flex;
  align-items: center;
  gap: 30px;
  color: #6b6f7d;
  font-size: 16px;
}

.site-header__nav-link {
  position: relative;
  padding: 4px 0;
  transition: color 0.25s ease;
}

.site-header__nav-link:hover,
.site-header__nav-link--active {
  color: var(--text-main);
}

.site-header__nav-link:hover::after,
.site-header__nav-link--active::after {
  transform: scaleX(1);
}

.site-header__nav-link::after {
  content: '';
  position: absolute;
  inset: auto 0 -4px;
  height: 2px;
  border-radius: 999px;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s ease;
  background: var(--brand-gradient);
}

.site-header__actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.icon-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  color: var(--brand-red);
  background: #fff0f4;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.icon-link:hover {
  transform: translateY(-1px);
  background: #ffe5ed;
}

.icon-link svg {
  display: block;
}

.icon-link__badge {
  position: absolute;
  top: -4px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  color: #fff;
  background: var(--brand-red);
  font-size: 10px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}

.profile-menu {
  position: relative;
}

.profile-menu__dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 184px;
  padding: 10px;
  border: 1px solid rgba(98, 38, 84, 0.08);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 20px 40px rgba(36, 16, 40, 0.12);
}

.profile-menu__item {
  display: flex;
  width: 100%;
  align-items: center;
  min-height: 42px;
  padding: 0 12px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #2f3340;
  cursor: pointer;
  text-align: left;
}

.profile-menu__item:hover {
  background: #f8f4f7;
}

.profile-menu__item--danger {
  color: var(--brand-red);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.logout-modal {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(24, 20, 29, 0.48);
}

.logout-modal__panel {
  width: min(420px, 100%);
  padding: 28px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 24px 54px rgba(36, 16, 40, 0.2);
}

.logout-modal__panel h2 {
  margin: 0 0 10px;
  font-size: 28px;
  line-height: 1.04;
}

.logout-modal__panel p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.6;
}

.logout-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.logout-modal__ghost {
  min-height: 45px;
  padding: 0 20px;
  border: 1px solid #dbdce2;
  border-radius: 22px;
  background: #fff;
  cursor: pointer;
}

@media (max-width: 900px) {
  .site-header__nav {
    display: none;
  }

  .site-header__inner {
    min-height: 88px;
  }
}

@media (max-width: 640px) {
  .site-header__inner {
    min-height: 88px;
  }

  .brand-mark__text {
    display: none;
  }

  .profile-menu__dropdown {
    right: -8px;
  }

  .logout-modal__actions {
    flex-direction: column-reverse;
  }

  .logout-modal__actions button {
    width: 100%;
  }
}
</style>
