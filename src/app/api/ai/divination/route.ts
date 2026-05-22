import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAiConfigGuidanceMessage } from "@/lib/ai/config-error";
import { buildDivinationPrompt } from "@/lib/ai/prompts";
import { getAiModel } from "@/lib/ai/provider";
import { textResponse } from "@/lib/ai/stream";
import { ensureUserProfile, getDivinationById, updateDivinationResult } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
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

function formatLocalLogTimestamp(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} Asia/Shanghai`;
}

function formatDivinationPromptLog(input: {
  divinationId: string;
  divinationType: string;
  mode: "full" | "short";
  model: string;
  system: string;
  prompt: string;
}) {
  const now = new Date();

  return [
    "",
    "===== AI DIVINATION REQUEST =====",
    `timestamp: ${formatLocalLogTimestamp(now)}`,
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
  mode: "full" | "short";
  model: string;
  system: string;
  prompt: string;
}) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

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
      mode?: "full" | "short";
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
      if (mode === "short") {
        return textResponse(
          "当前 AI 环境变量未完整配置，暂时无法生成短判词。请优先使用 `corepack pnpm dev:vercel` 启动本地环境，或补齐 `.env.local` 里的 `AI_PROVIDER`、`AI_MODEL`、`AI_BASE_URL` 和 `AI_API_KEY`。",
        );
      }

      return textResponse(getAiConfigGuidanceMessage());
    }

    const prompt = buildDivinationPrompt(record, mode);
    const modelName = process.env.AI_MODEL ?? "unknown";
    const divinationType = resolveDivinationTypeFromRecord(record);

    await logDivinationPrompt({
      divinationId: record.id,
      divinationType,
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
