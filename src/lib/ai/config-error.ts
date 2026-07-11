export function getAiConfigGuidanceMessage() {
  return [
    "当前 AI 环境变量未完整配置，暂时无法调用真实模型。",
    "",
    "如果你在本地开发，优先使用 `bun run dev:vercel` 启动，这样会直接注入 Vercel production 环境变量。",
    "如果你使用 `.env.local`，请确认至少补齐 `AI_PROVIDER`、`AI_MODEL`、`AI_BASE_URL` 和 `AI_API_KEY`。",
  ].join("\n");
}
