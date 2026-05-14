import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getEnv } from "@/lib/env";

export function getAiModel() {
  const env = getEnv();

  if (env.AI_PROVIDER === "openai-compatible") {
    const isOpenRouter = env.AI_BASE_URL?.includes("openrouter.ai");
    const openRouterHeaders =
      isOpenRouter && env.BETTER_AUTH_URL
        ? {
            "HTTP-Referer": env.BETTER_AUTH_URL,
            "X-OpenRouter-Title": "知微",
          }
        : undefined;

    return createOpenAICompatible({
      baseURL: env.AI_BASE_URL!,
      apiKey: env.AI_API_KEY!,
      name: isOpenRouter ? "openrouter" : "custom-compatible",
      headers: openRouterHeaders,
    }).chatModel(env.AI_MODEL!);
  }

  return env.AI_MODEL ?? "openai/gpt-5.4";
}
