import { streamText } from "ai";
import { NextResponse } from "next/server";
import { buildDivinationPrompt } from "@/lib/ai/prompts";
import { getAiModel } from "@/lib/ai/provider";
import { textResponse } from "@/lib/ai/stream";
import { hasAiProviderEnv } from "@/lib/env";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export async function POST(request: Request) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as { divinationId?: string };

  if (!payload.divinationId) {
    return NextResponse.json({ error: "Missing divinationId" }, { status: 400 });
  }

  const { data: rawRecord } = await supabase
    .from("divinations")
    .select("*")
    .eq("id", payload.divinationId)
    .eq("user_id", user.id)
    .maybeSingle();
  const record = rawRecord as Database["public"]["Tables"]["divinations"]["Row"] | null;

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
      await supabase
        .from("divinations")
        .update({
          ai_result_markdown: text,
          ai_model: process.env.AI_MODEL ?? "unknown",
          status: "completed",
        } as never)
        .eq("id", record.id)
        .eq("user_id", user.id);
    },
  });

  return result.toTextStreamResponse();
}
