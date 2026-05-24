import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { oneTap } from "better-auth/plugins";
import { Pool } from "pg";
import { getAppBaseUrl, getEnv, getGoogleOAuthConfig } from "@/lib/env";

const env = getEnv();
const googleOAuthConfig = getGoogleOAuthConfig();

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
    // Browsers reject cookies whose Max-Age exceeds 400 days.
    expiresIn: 60 * 60 * 24 * 400,
    updateAge: 60 * 60 * 24 * 30,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [oneTap(), nextCookies()],
  socialProviders: googleOAuthConfig
    ? {
        google: {
          clientId: googleOAuthConfig.clientId,
          clientSecret: googleOAuthConfig.clientSecret,
          prompt: "select_account",
        },
      }
    : undefined,
});
