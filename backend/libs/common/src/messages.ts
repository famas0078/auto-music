export const SERVICES = {
  catalog: 'CATALOG_SERVICE',
  content: 'CONTENT_SERVICE',
  users: 'USERS_SERVICE',
} as const;

export const PATTERNS = {
  catalog: {
    newProducts: 'catalog.new-products',
    weeklyProducts: 'catalog.weekly-products',
    products: 'catalog.products',
    productBySlug: 'catalog.product-by-slug',
  },
  content: {
    guarantees: 'content.guarantees',
    testimonials: 'content.testimonials',
    newsletter: 'content.newsletter',
  },
  users: {
    login: 'users.login',
    register: 'users.register',
    createOrder: 'users.create-order',
    orders: 'users.orders',
  },
} as const;
