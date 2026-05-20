import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getAppBaseUrl, getEnv } from "@/lib/env";

export function getAiModel() {
  const env = getEnv();

  if (env.AI_PROVIDER === "openai-compatible") {
    const isOpenRouter = env.AI_BASE_URL?.includes("openrouter.ai");
    const appBaseUrl = getAppBaseUrl();
    const openRouterHeaders =
      isOpenRouter && appBaseUrl
        ? {
            "HTTP-Referer": appBaseUrl,
            "X-OpenRouter-Title": "zhiwei",
          }
        : undefined;

    return createOpenAICompatible({
      baseURL: env.AI_BASE_URL!,
      apiKey: env.AI_API_KEY!,
      name: isOpenRouter ? "openrouter" : "custom-compatible",
      headers: openRouterHeaders,
    }).chatModel(env.AI_MODEL!);
  }

  return env.AI_MODEL ?? "deepseek/deepseek-v4-pro";
}
