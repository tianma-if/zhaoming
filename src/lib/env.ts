import { z } from "zod";

const LOCAL_APP_URL = "http://localhost:5555";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  AI_PROVIDER: z.enum(["gateway", "openai-compatible"]).optional(),
  AI_MODEL: z.string().min(1).optional(),
  AI_BASE_URL: z.string().url().optional(),
  AI_API_KEY: z.string().min(1).optional(),
  AUTOMATION_API_KEY: z.string().min(1).optional(),
});

type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

function readEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}

export function getEnv() {
  return readEnv();
}

function isDevelopmentRuntime() {
  return process.env.NODE_ENV !== "production";
}

function isLoopbackUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}

export function getAppBaseUrl() {
  const env = readEnv();

  if (env.BETTER_AUTH_URL) {
    if (isDevelopmentRuntime() && !isLoopbackUrl(env.BETTER_AUTH_URL)) {
      return LOCAL_APP_URL;
    }

    return env.BETTER_AUTH_URL;
  }

  return isDevelopmentRuntime() ? LOCAL_APP_URL : undefined;
}

export function hasDatabaseEnv() {
  const env = readEnv();
  return Boolean(env.DATABASE_URL);
}

export function hasAuthEnv() {
  const env = readEnv();
  return Boolean(env.BETTER_AUTH_SECRET && getAppBaseUrl());
}

export function hasGoogleOAuthEnv() {
  const env = readEnv();
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

export function hasAiProviderEnv() {
  const env = readEnv();

  if (env.AI_PROVIDER === "openai-compatible") {
    return Boolean(env.AI_BASE_URL && env.AI_API_KEY && env.AI_MODEL);
  }

  return Boolean(env.AI_MODEL);
}
