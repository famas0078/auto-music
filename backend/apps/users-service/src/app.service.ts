import { Injectable, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  AuthPayload,
  AuthResponse,
  CreateOrderResponse,
  Order,
  OrderItemPayload,
  OrderPayload,
  OrdersPayload,
  OrdersResponse,
  SessionUser,
} from '@app/common';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'crypto';
import { DatabaseService } from './database.service';

type UserRow = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  password_hash: string;
};

type SessionRow = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
};

type OrderRow = {
  order_id: number;
  order_number: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  note: string | null;
  status: string;
  total: number;
  item_id: number;
  product_id: string;
  slug: string;
  title: string;
  price_label: string;
  price_value: number;
  image_src: string | null;
  quantity: number;
};

const DEMO_USER = {
  email: 'demo@example.com',
  name: 'demo',
  password: 'password123',
  phone: '+7 (999) 111 22 33',
};

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.database.ensureSchema();
    await this.ensureSeedUser();
  }

  async login(payload: AuthPayload): Promise<AuthResponse> {
    const email = this.normalizeEmail(payload.email);
    const user = await this.findUserByEmail(email);

    if (!user || !this.verifyPassword(payload.password, user.password_hash)) {
      throw this.rpcError('Неверный email или пароль', 401);
    }

    const token = await this.createSession(user.id);

    return {
      message: 'Авторизация выполнена успешно',
      token,
      user: this.toSessionUser(user),
    };
  }

  async register(payload: AuthPayload): Promise<AuthResponse> {
    const email = this.normalizeEmail(payload.email);

    if (payload.password !== payload.confirmPassword) {
      throw this.rpcError('Пароли не совпадают', 400);
    }

    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw this.rpcError('Пользователь с таким email уже существует', 409);
    }

    const passwordHash = this.hashPassword(payload.password);
    const insertResult = await this.database.query<UserRow>(
      `
        INSERT INTO users (email, name, phone, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name, phone, password_hash
      `,
      [email, payload.name?.trim() || 'Новый пользователь', payload.phone?.trim() || '', passwordHash],
    );
    const user = insertResult.rows[0];
    const token = await this.createSession(user.id);

    return {
      message: 'Регистрация завершена',
      token,
      user: this.toSessionUser(user),
    };
  }

  async createOrder(payload: OrderPayload): Promise<CreateOrderResponse> {
    const sessionUser = await this.requireUserByToken(payload.token);

    if (!payload.items.length) {
      throw this.rpcError('Корзина пуста', 400);
    }

    const order = await this.database.withTransaction<Order>(async (query) => {
      const orderNumber = this.generateOrderNumber();
      const orderResult = await query<{
        id: number;
        order_number: string;
        created_at: string;
        customer_name: string;
        customer_email: string;
        customer_phone: string | null;
        note: string | null;
        status: string;
        total: number;
      }>(
        `
          INSERT INTO orders (
            order_number,
            user_id,
            customer_name,
            customer_email,
            customer_phone,
            note,
            status,
            total
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, order_number, created_at, customer_name, customer_email, customer_phone, note, status, total
        `,
        [
          orderNumber,
          sessionUser.id,
          payload.customer.name.trim(),
          payload.customer.email.trim(),
          payload.customer.phone?.trim() || '',
          payload.note?.trim() || '',
          'Оформлен',
          payload.total,
        ],
      );
      const orderRow = orderResult.rows[0];

      for (const item of payload.items) {
        await query(
          `
            INSERT INTO order_items (order_id, product_id, slug, title, price_label, price_value, image_src, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
          [
            orderRow.id,
            item.id,
            item.slug,
            item.title,
            item.price,
            item.priceValue,
            item.imageSrc || '',
            item.quantity,
          ],
        );
      }

      return {
        id: orderRow.order_number,
        createdAt: orderRow.created_at,
        customer: {
          email: orderRow.customer_email,
          name: orderRow.customer_name,
          phone: orderRow.customer_phone || '',
        },
        items: payload.items,
        note: orderRow.note || '',
        status: orderRow.status,
        total: orderRow.total,
      };
    });

    return {
      message: `Спасибо, ${order.customer.name}. Заказ отправлен, мы свяжемся с вами в ближайшее время.`,
      order,
    };
  }

  async getOrders(payload: OrdersPayload): Promise<OrdersResponse> {
    const sessionUser = await this.requireUserByToken(payload.token);
    const result = await this.database.query<OrderRow>(
      `
        SELECT
          o.id AS order_id,
          o.order_number,
          o.created_at,
          o.customer_name,
          o.customer_email,
          o.customer_phone,
          o.note,
          o.status,
          o.total,
          oi.id AS item_id,
          oi.product_id,
          oi.slug,
          oi.title,
          oi.price_label,
          oi.price_value,
          oi.image_src,
          oi.quantity
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC, oi.id ASC
      `,
      [sessionUser.id],
    );

    return {
      orders: this.mapOrders(result.rows),
    };
  }

  async ensureSeedUser() {
    const existingUser = await this.findUserByEmail(DEMO_USER.email);

    if (existingUser) {
      return;
    }

    await this.database.query(
      `
        INSERT INTO users (email, name, phone, password_hash)
        VALUES ($1, $2, $3, $4)
      `,
      [DEMO_USER.email, DEMO_USER.name, DEMO_USER.phone, this.hashPassword(DEMO_USER.password)],
    );
  }

  private async createSession(userId: number) {
    const token = randomUUID();
    await this.database.query(
      `
        INSERT INTO sessions (token, user_id)
        VALUES ($1, $2)
      `,
      [token, userId],
    );
    return token;
  }

  private async findUserByEmail(email: string) {
    const result = await this.database.query<UserRow>(
      `
        SELECT id, email, name, phone, password_hash
        FROM users
        WHERE email = $1
      `,
      [email],
    );

    return result.rows[0];
  }

  private generateOrderNumber() {
    return `AM-${Date.now().toString().slice(-8)}${randomBytes(2).toString('hex').toUpperCase()}`;
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private mapOrders(rows: OrderRow[]): Order[] {
    const orders = new Map<string, Order>();

    rows.forEach((row) => {
      if (!orders.has(row.order_number)) {
        orders.set(row.order_number, {
          id: row.order_number,
          createdAt: row.created_at,
          customer: {
            email: row.customer_email,
            name: row.customer_name,
            phone: row.customer_phone || '',
          },
          items: [],
          note: row.note || '',
          status: row.status,
          total: row.total,
        });
      }

      const order = orders.get(row.order_number)!;

      if (row.item_id) {
        order.items.push({
          id: row.product_id,
          slug: row.slug,
          title: row.title,
          price: row.price_label,
          priceValue: row.price_value,
          imageSrc: row.image_src || '',
          quantity: row.quantity,
        });
      }
    });

    return [...orders.values()];
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private rpcError(message: string, statusCode: number) {
    return new RpcException({ message, statusCode });
  }

  private async requireUserByToken(token: string) {
    const result = await this.database.query<SessionRow>(
      `
        SELECT u.id, u.email, u.name, u.phone
        FROM sessions s
        INNER JOIN users u ON u.id = s.user_id
        WHERE s.token = $1
      `,
      [token],
    );
    const user = result.rows[0];

    if (!user) {
      throw this.rpcError('Сессия недействительна, войдите снова', 401);
    }

    return user;
  }

  private toSessionUser(user: Pick<UserRow, 'email' | 'name' | 'phone'>): SessionUser {
    return {
      email: user.email,
      name: user.name,
      phone: user.phone || '',
    };
  }

  private verifyPassword(password: string, storedHash: string) {
    const [salt, existingHash] = storedHash.split(':');

    if (!salt || !existingHash) {
      return false;
    }

    const candidateHash = scryptSync(password, salt, 64);
    const existingBuffer = Buffer.from(existingHash, 'hex');

    return existingBuffer.length === candidateHash.length && timingSafeEqual(existingBuffer, candidateHash);
  }
}
