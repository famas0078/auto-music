import { reactive } from 'vue';
import { api } from '../services/api';

const state = reactive({
  items: [],
  loading: false,
  error: '',
});

export const ordersStore = {
  state,
  async create(payload) {
    const response = await api.createOrder(payload);
    state.items.unshift(response.order);
    return response;
  },
  async fetch() {
    state.loading = true;
    state.error = '';

    try {
      const response = await api.getOrders();
      state.items = response.orders;
    } catch (error) {
      state.error = error.message;
      throw error;
    } finally {
      state.loading = false;
    }
  },
  reset() {
    state.items = [];
    state.loading = false;
    state.error = '';
  },
};
