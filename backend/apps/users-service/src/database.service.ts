import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    database: process.env.POSTGRES_DB || 'automusic',
    host: process.env.POSTGRES_HOST || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'automusic',
    port: Number.parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'automusic',
  });

  async onModuleInit() {
    await this.ensureSchema();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  query<T extends QueryResultRow>(sql: string, params: unknown[] = []) {
    return this.pool.query<T>(sql, params);
  }

  async withTransaction<T>(
    callback: (
      query: <TRow extends QueryResultRow>(sql: string, params?: unknown[]) => Promise<QueryResult<TRow>>,
    ) => Promise<T>,
  ) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(<TRow extends QueryResultRow>(sql: string, params: unknown[] = []) =>
        client.query<TRow>(sql, params),
      );
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async ensureSchema() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        note TEXT,
        status TEXT NOT NULL,
        total INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        price_label TEXT NOT NULL,
        price_value INTEGER NOT NULL,
        image_src TEXT,
        quantity INTEGER NOT NULL
      );
    `);
  }
}
