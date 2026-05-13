import { streamText } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildDivinationPrompt } from "@/lib/ai/prompts";
import { getAiModel } from "@/lib/ai/provider";
import { textResponse } from "@/lib/ai/stream";
import { ensureUserProfile, getDivinationById, updateDivinationResult } from "@/lib/data";
import { hasAiProviderEnv } from "@/lib/env";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const user = session?.user ?? null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserProfile(user);

  const payload = (await request.json()) as { divinationId?: string };

  if (!payload.divinationId) {
    return NextResponse.json({ error: "Missing divinationId" }, { status: 400 });
  }

  const record = await getDivinationById(user.id, payload.divinationId);

  if (!record) {
    return NextResponse.json({ error: "Record not found." }, { status: 404 });
  }

  if (!hasAiProviderEnv()) {
    return textResponse(
      [
        "模型配置尚未完成，因此这里先返回引导文本。",
        "",
        "你已经拥有完整的结构化排盘、测算记录入库、流式输出 UI 和 Provider 抽象。",
        "只要补上 `.env.local` 里的 `AI_PROVIDER`、`AI_MODEL` 与对应密钥，就能切换到真实模型。",
      ].join("\n"),
    );
  }

  const prompt = buildDivinationPrompt(record);

  const result = streamText({
    model: getAiModel(),
    system: prompt.system,
    prompt: prompt.prompt,
    onFinish: async ({ text }) => {
      await updateDivinationResult({
        id: record.id,
        userId: user.id,
        markdown: text,
        aiModel: process.env.AI_MODEL ?? "unknown",
      });
    },
  });

  return result.toTextStreamResponse();
}
