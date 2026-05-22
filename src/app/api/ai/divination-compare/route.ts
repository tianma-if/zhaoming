import { performance } from "node:perf_hooks";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAiConfigGuidanceMessage } from "@/lib/ai/config-error";
import { buildDivinationPrompt } from "@/lib/ai/prompts";
import { BAZI_DEMO_MODEL_OPTIONS, getComparableAiModel } from "@/lib/ai/model-comparison";
import { getAiModel } from "@/lib/ai/provider";
import { ensureUserProfile, getDivinationById } from "@/lib/data";
import { hasAiProviderEnv } from "@/lib/env";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";

const compareRequestSchema = z.object({
  divinationId: z.string().min(1),
  mode: z.enum(["short", "full"]).default("full"),
  models: z.array(z.string().min(1)).min(1).max(6),
});

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

    if (!hasAiProviderEnv()) {
      return NextResponse.json(
        { error: getAiConfigGuidanceMessage() },
        { status: 400 },
      );
    }

    const payload = compareRequestSchema.parse(await request.json());
    const record = await getDivinationById(user.id, payload.divinationId);

    if (!record) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    if (resolveDivinationTypeFromRecord(record) !== "bazi") {
      return NextResponse.json(
        { error: "The comparison demo currently supports bazi records only." },
        { status: 400 },
      );
    }

    const prompt = buildDivinationPrompt(record, payload.mode);
    const supportedModelIds = new Set(BAZI_DEMO_MODEL_OPTIONS.map((item) => item.id));
    const uniqueModelIds = [...new Set(payload.models)].filter((modelId) =>
      supportedModelIds.has(modelId),
    );

    if (!uniqueModelIds.length) {
      return NextResponse.json(
        { error: "No supported models were selected." },
        { status: 400 },
      );
    }

    const outputs = await Promise.all(
      uniqueModelIds.map(async (modelId) => {
        const startedAt = performance.now();

        try {
          const result = await generateText({
            model: getAiModel(modelId),
            system: prompt.system,
            prompt: prompt.prompt,
          });

          return {
            modelId,
            label: getComparableAiModel(modelId)?.label ?? modelId,
            vendor: getComparableAiModel(modelId)?.vendor ?? "",
            durationMs: Math.round(performance.now() - startedAt),
            text: result.text,
            error: null,
          };
        } catch (error) {
          return {
            modelId,
            label: getComparableAiModel(modelId)?.label ?? modelId,
            vendor: getComparableAiModel(modelId)?.vendor ?? "",
            durationMs: Math.round(performance.now() - startedAt),
            text: "",
            error: error instanceof Error ? error.message : "Generation failed.",
          };
        }
      }),
    );

    return NextResponse.json({
      divinationId: record.id,
      mode: payload.mode,
      system: prompt.system,
      prompt: prompt.prompt,
      outputs,
    });
  } catch (error) {
    console.error("AI divination comparison failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "AI divination comparison failed.",
      },
      { status: 500 },
    );
  }
}
