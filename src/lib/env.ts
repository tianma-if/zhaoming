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
  STRIPE_SECRET_KEY: optionalNonEmptyString(),
  STRIPE_WEBHOOK_SECRET: optionalNonEmptyString(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalNonEmptyString(),
  STRIPE_PRICE_SINGLE_REPORT: optionalNonEmptyString(),
  STRIPE_PRICE_STARTER_PACK: optionalNonEmptyString(),
  STRIPE_PRICE_POPULAR_PACK: optionalNonEmptyString(),
  STRIPE_PRICE_DEEP_DIVE_PACK: optionalNonEmptyString(),
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

export function hasStripeSecretEnv() {
  const env = readEnv();
  return Boolean(env.STRIPE_SECRET_KEY);
}

export function hasStripeWebhookEnv() {
  const env = readEnv();
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}

export function hasStripeCheckoutEnv() {
  const env = readEnv();

  return Boolean(
    env.STRIPE_PRICE_SINGLE_REPORT &&
      env.STRIPE_PRICE_STARTER_PACK &&
      env.STRIPE_PRICE_POPULAR_PACK &&
      env.STRIPE_PRICE_DEEP_DIVE_PACK,
  );
}
