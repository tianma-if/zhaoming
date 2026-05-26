import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { getEnv } from "@/lib/env";

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    const env = getEnv();

    pool = new Pool({
      connectionString:
        env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5432/postgres",
    });
  }

  return pool;
}

export async function query<T extends QueryResultRow>(
  sql: string,
  params: unknown[] = [],
) {
  return getPool().query<T>(sql, params);
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();

  try {
    await client.query("begin");
    const result = await callback(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
