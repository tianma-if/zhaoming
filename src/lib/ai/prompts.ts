import type { Database } from "@/types/database";
import {
  getDivinationPromptTemplate,
  type DivinationPromptMode,
} from "@/lib/ai/divination-prompts";
import { buildDivinationPromptInput } from "@/lib/ai/divination-prompt-input";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import type { SanshiChart, SanshiSystem } from "@/types/divination";

type DivinationRecord = Database["public"]["Tables"]["divinations"]["Row"];

function resolvePromptTemplateType(record: DivinationRecord) {
  const divinationType = resolveDivinationTypeFromRecord(record);

  if (divinationType !== "sanshi") {
    return divinationType;
  }

  const chart = record.chart_json as Partial<SanshiChart> | null;
  const system = chart?.meta?.system as SanshiSystem | undefined;

  if (system === "qimen" || system === "taiyi" || system === "liuren") {
    return `sanshi:${system}` as const;
  }

  return divinationType;
}

export function buildDivinationPrompt(
  record: DivinationRecord,
  mode: DivinationPromptMode = "full",
) {
  const template = getDivinationPromptTemplate(resolvePromptTemplateType(record), mode);

  return {
    system: template.system,
    prompt: buildDivinationPromptInput(record),
  };
}
