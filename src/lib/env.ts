import { z } from "zod";

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

export function hasDatabaseEnv() {
  const env = readEnv();
  return Boolean(env.DATABASE_URL);
}

export function hasAuthEnv() {
  const env = readEnv();
  return Boolean(env.BETTER_AUTH_SECRET && env.BETTER_AUTH_URL);
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
