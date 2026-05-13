import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { getEnv, hasGoogleOAuthEnv } from "@/lib/env";

const env = getEnv();

function getAuthDatabaseUrl() {
  const rawUrl =
    env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5432/postgres";

  try {
    const url = new URL(rawUrl);
    url.searchParams.set("options", "-c search_path=neon_auth,public");
    return url.toString();
  } catch {
    return `${rawUrl}?options=-c%20search_path%3Dneon_auth%2Cpublic`;
  }
}

const database = new Pool({
  connectionString: getAuthDatabaseUrl(),
});

export const auth = betterAuth({
  appName: "知微",
  baseURL: env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret:
    env.BETTER_AUTH_SECRET ??
    "development-placeholder-secret-change-me-123456",
  database,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: hasGoogleOAuthEnv()
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID!,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
          prompt: "select_account",
        },
      }
    : undefined,
});
