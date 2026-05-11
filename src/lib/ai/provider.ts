import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { getEnv } from "@/lib/env";

export function getAiModel() {
  const env = getEnv();

  if (env.AI_PROVIDER === "openai-compatible") {
    return createOpenAICompatible({
      baseURL: env.AI_BASE_URL!,
      apiKey: env.AI_API_KEY!,
      name: "custom-compatible",
    }).chatModel(env.AI_MODEL!);
  }

  return env.AI_MODEL ?? "openai/gpt-5.4";
}
