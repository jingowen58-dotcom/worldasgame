import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { Pool, type PoolClient } from "pg";

type Row = Record<string, unknown>;
type QueryFn = <T extends Row>(sql: string, params?: unknown[]) => Promise<T[]>;

const globalDb = globalThis as unknown as {
  worldasgameDbV4?: Promise<{ query: QueryFn; transaction: <T>(fn: (query: QueryFn) => Promise<T>) => Promise<T> }>;
};

function rowsOf<T extends Row>(result: { rows: T[] }): T[] {
  return result.rows;
}

async function openDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    const host = new URL(databaseUrl).hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: isLocal ? undefined : { rejectUnauthorized: false },
    });
    const query: QueryFn = async (sql, params = []) => rowsOf(await pool.query(sql, params));
    await query("SELECT 1 AS ok");
    await pool.query(readFileSync(path.join(process.cwd(), "server/schema.sql"), "utf8"));
    return {
      query,
      transaction: async <T>(fn: (query: QueryFn) => Promise<T>) => {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const result = await fn(clientQuery(client));
          await client.query("COMMIT");
          return result;
        } catch (error) {
          await client.query("ROLLBACK");
          throw error;
        } finally {
          client.release();
        }
      },
    };
  }

  const dataDir = path.join(process.cwd(), ".data", "pglite");
  mkdirSync(dataDir, { recursive: true });
  const db = new PGlite(dataDir);
  await db.waitReady;
  await db.exec(readFileSync(path.join(process.cwd(), "server/schema.sql"), "utf8"));
  const query: QueryFn = async (sql, params = []) => rowsOf(await db.query(sql, params));
  return {
    query,
    transaction: async <T>(fn: (query: QueryFn) => Promise<T>) =>
      db.transaction(async (tx) => fn(async (sql, params = []) => rowsOf(await tx.query(sql, params)))),
  };
}

function clientQuery(client: PoolClient): QueryFn {
  return async (sql, params = []) => rowsOf(await client.query(sql, params));
}

export async function database() {
  if (!globalDb.worldasgameDbV4) {
    globalDb.worldasgameDbV4 = openDatabase().catch((error: unknown) => {
      globalDb.worldasgameDbV4 = undefined;
      throw error;
    });
  }
  return globalDb.worldasgameDbV4;
}

export async function query<T extends Row>(sql: string, params: unknown[] = []) {
  const db = await database();
  return db.query<T>(sql, params);
}

export async function transaction<T>(fn: (query: QueryFn) => Promise<T>) {
  const db = await database();
  return db.transaction(fn);
}
