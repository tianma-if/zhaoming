import { z } from "zod";

const LOCAL_APP_URL = "http://localhost:5555";

function optionalNonEmptyString() {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }, z.string().min(1).optional());
}

const envSchema = z.object({
  DATABASE_URL: optionalNonEmptyString(),
  BETTER_AUTH_SECRET: z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }, z.string().min(32).optional()),
  BETTER_AUTH_URL: z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }, z.string().url().optional()),
  GOOGLE_CLIENT_ID: optionalNonEmptyString(),
  GOOGLE_CLIENT_SECRET: optionalNonEmptyString(),
  GOOGLE_CLIENT_ID_LOCAL: optionalNonEmptyString(),
  GOOGLE_CLIENT_SECRET_LOCAL: optionalNonEmptyString(),
  AI_PROVIDER: z.enum(["gateway", "openai-compatible"]).optional(),
  AI_MODEL: optionalNonEmptyString(),
  AI_BASE_URL: z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }, z.string().url().optional()),
  AI_API_KEY: optionalNonEmptyString(),
  AUTOMATION_API_KEY: optionalNonEmptyString(),
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
  return Boolean(getGoogleOAuthConfig());
}

export function getGoogleOAuthConfig() {
  const env = readEnv();
  const useLocalGoogleClient =
    isDevelopmentRuntime() &&
    Boolean(env.GOOGLE_CLIENT_ID_LOCAL && env.GOOGLE_CLIENT_SECRET_LOCAL);

  if (useLocalGoogleClient) {
    return {
      clientId: env.GOOGLE_CLIENT_ID_LOCAL!,
      clientSecret: env.GOOGLE_CLIENT_SECRET_LOCAL!,
    };
  }

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return null;
  }

  return {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  };
}

export function getGoogleOneTapClientId() {
  const env = readEnv();

  if (isDevelopmentRuntime() && env.GOOGLE_CLIENT_ID_LOCAL) {
    return env.GOOGLE_CLIENT_ID_LOCAL;
  }

  return env.GOOGLE_CLIENT_ID;
}

export function hasAiProviderEnv() {
  const env = readEnv();

  if (env.AI_PROVIDER === "openai-compatible") {
    return Boolean(env.AI_BASE_URL && env.AI_API_KEY && env.AI_MODEL);
  }

  return Boolean(env.AI_MODEL);
}
