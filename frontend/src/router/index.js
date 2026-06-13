import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import AuthPage from '../pages/AuthPage.vue';
import CatalogPage from '../pages/CatalogPage.vue';
import ProductPage from '../pages/ProductPage.vue';
import CartPage from '../pages/CartPage.vue';
import OrdersPage from '../pages/OrdersPage.vue';
import { authStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: CatalogPage,
  },
  {
    path: '/product/:slug',
    name: 'product',
    component: ProductPage,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: AuthPage,
    props: { initialTab: 'login' },
    meta: { hideHeader: true, hideFooter: true, viewKey: 'auth', guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: AuthPage,
    props: { initialTab: 'register' },
    meta: { hideHeader: true, hideFooter: true, viewKey: 'auth', guestOnly: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 120,
      };
    }

    if (to.path === from.path) {
      return false;
    }

    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/';
    return redirect;
  }

  return true;
});

router.afterEach((to) => {
  document.body.classList.toggle('no-header', Boolean(to.meta.hideHeader));
  document.body.classList.toggle('no-footer', Boolean(to.meta.hideFooter));
});

export default router;
