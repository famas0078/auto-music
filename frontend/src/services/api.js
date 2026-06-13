import { authStore } from '../stores/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authStore.state.token && !headers.Authorization) {
    headers.Authorization = `Bearer ${authStore.state.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({
      message: 'Не удалось выполнить запрос',
    }));

    throw new Error(payload.message || 'Не удалось выполнить запрос');
  }

  return response.json();
}

export const api = {
  getHome() {
    return request('/home');
  },
  getProducts() {
    return request('/products');
  },
  getProduct(slug) {
    return request(`/products/${slug}`);
  },
  getOrders() {
    return request('/orders');
  },
  createOrder(payload) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  subscribe(email) {
    return request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};
