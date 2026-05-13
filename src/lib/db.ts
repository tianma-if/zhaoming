import { Pool, type QueryResultRow } from "pg";
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
