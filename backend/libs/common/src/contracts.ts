export interface Product {
  id: string;
  slug: string;
  title: string;
  price: string;
  priceValue: number;
  oldPrice?: string;
  oldPriceValue?: number;
  discount?: string;
  theme: 'mono' | 'duo' | 'subwoofer' | 'placeholder';
  category: 'subwoofers' | 'speakers' | 'amplifiers' | 'processors';
  brand: string;
  series: string;
  inStock: boolean;
  badge?: string;
  shortDescription: string;
  description: string;
  specs: Array<{ label: string; value: string }>;
  imageKey?: string;
}

export interface Guarantee {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export interface HomePayload {
  guarantees: Guarantee[];
  newProducts: Product[];
  weeklyProducts: Product[];
  testimonials: Testimonial[];
}

export interface CatalogPayload {
  products: Product[];
  categories: Array<{ id: Product['category']; label: string }>;
  brands: string[];
}

export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  confirmPassword?: string;
}

export interface SessionUser {
  email: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: SessionUser;
}

export interface OrderItemPayload {
  id: string;
  slug: string;
  title: string;
  price: string;
  priceValue: number;
  imageSrc?: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customer: SessionUser;
  items: OrderItemPayload[];
  note?: string;
  total: number;
}

export interface OrderPayload extends CreateOrderPayload {
  token: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: SessionUser;
  items: OrderItemPayload[];
  note?: string;
  status: string;
  total: number;
}

export interface OrdersPayload {
  token: string;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
}
