import { reactive } from 'vue';

const STORAGE_KEY = 'automusic-cart';

const savedItems = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;

const state = reactive({
  items: savedItems ? JSON.parse(savedItems) : [],
  checkoutOpen: false,
});

function persist() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

export const cartStore = {
  state,
  get count() {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },
  get total() {
    return state.items.reduce((total, item) => total + item.quantity * item.priceValue, 0);
  },
  hasProduct(productId) {
    return state.items.some((item) => item.id === productId);
  },
  add(product, quantity = 1) {
    const existing = state.items.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      state.items.push({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        priceValue: product.priceValue,
        imageSrc: product.imageSrc || '',
        quantity,
      });
    }

    persist();
  },
  updateQuantity(productId, quantity) {
    const target = state.items.find((item) => item.id === productId);
    if (!target) {
      return;
    }

    target.quantity = Math.max(1, quantity);
    persist();
  },
  remove(productId) {
    const index = state.items.findIndex((item) => item.id === productId);
    if (index >= 0) {
      state.items.splice(index, 1);
      persist();
    }
  },
  clear() {
    state.items.splice(0, state.items.length);
    persist();
  },
  openCheckout() {
    state.checkoutOpen = true;
  },
  closeCheckout() {
    state.checkoutOpen = false;
  },
};
