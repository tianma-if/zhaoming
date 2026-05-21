import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { getAppBaseUrl, getEnv, hasGoogleOAuthEnv } from "@/lib/env";

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
  baseURL: getAppBaseUrl() ?? "http://localhost:5555",
  secret:
    env.BETTER_AUTH_SECRET ??
    "development-placeholder-secret-change-me-123456",
  database,
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 365 * 3,
    updateAge: 60 * 60 * 24 * 30,
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
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
