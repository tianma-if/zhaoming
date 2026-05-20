import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildDivinationPrompt } from "@/lib/ai/prompts";
import { getAiModel } from "@/lib/ai/provider";
import { textResponse } from "@/lib/ai/stream";
import { ensureUserProfile, getDivinationById, updateDivinationResult } from "@/lib/data";
import { hasAiProviderEnv } from "@/lib/env";

function getHourlyDivinationPromptLogPath(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  const timestamp = `${parts.year}-${parts.month}-${parts.day}-${parts.hour}`;

  return path.join(process.cwd(), "logs", `ai-divination-prompts-${timestamp}.log`);
}

function formatDivinationPromptLog(input: {
  divinationId: string;
  divinationType: string;
  mode: "full" | "verdict";
  model: string;
  system: string;
  prompt: string;
}) {
  return [
    "",
    "===== AI DIVINATION REQUEST =====",
    `timestamp: ${new Date().toISOString()}`,
    `divinationId: ${input.divinationId}`,
    `divinationType: ${input.divinationType}`,
    `mode: ${input.mode}`,
    `model: ${input.model}`,
    "",
    "[system]",
    input.system,
    "",
    "[prompt]",
    input.prompt,
    "===== END AI DIVINATION REQUEST =====",
    "",
  ].join("\n");
}

async function logDivinationPrompt(input: {
  divinationId: string;
  divinationType: string;
  mode: "full" | "verdict";
  model: string;
  system: string;
  prompt: string;
}) {
  const logBody = formatDivinationPromptLog(input);
  const logPath = getHourlyDivinationPromptLogPath();

  try {
    await mkdir(path.dirname(logPath), { recursive: true });
    await appendFile(logPath, `${logBody}\n`, "utf8");
  } catch (error) {
    console.error("Failed to write AI divination prompt log:", error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user ?? null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureUserProfile(user);

    const payload = (await request.json()) as {
      divinationId?: string;
      mode?: "full" | "verdict";
    };
    const mode = payload.mode ?? "full";

    if (!payload.divinationId) {
      return NextResponse.json({ error: "Missing divinationId" }, { status: 400 });
    }

    const record = await getDivinationById(user.id, payload.divinationId);

    if (!record) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    if (!hasAiProviderEnv()) {
      if (mode === "verdict") {
        return textResponse(
          "模型配置尚未完成。当前可以先阅读页面中的结构摘要；补齐 AI Provider 环境变量后，这里会生成更贴近命盘气质的命格判词。",
        );
      }

      return textResponse(
        [
          "模型配置尚未完成，因此这里先返回引导文本。",
          "",
          "你已经拥有完整的结构化排盘、测算记录入库、流式输出 UI 和 Provider 抽象。",
          "只要补上 `.env.local` 里的 `AI_PROVIDER`、`AI_MODEL` 与对应密钥，就能切换到真实模型。",
        ].join("\n"),
      );
    }

    const prompt = buildDivinationPrompt(record, mode);
    const modelName = process.env.AI_MODEL ?? "unknown";

    await logDivinationPrompt({
      divinationId: record.id,
      divinationType: record.divination_type,
      mode,
      model: modelName,
      system: prompt.system,
      prompt: prompt.prompt,
    });

    const result = streamText({
      model: getAiModel(),
      system: prompt.system,
      prompt: prompt.prompt,
      onFinish: async ({ text }) => {
        if (mode === "full") {
          await updateDivinationResult({
            id: record.id,
            userId: user.id,
            markdown: text,
            aiModel: modelName,
          });
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI divination generation failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "AI divination generation failed.",
      },
      { status: 500 },
    );
  }
}
