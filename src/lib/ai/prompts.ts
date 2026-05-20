import type { Database } from "@/types/database";
import {
  DIVINATION_PROMPT_INPUT_LABELS,
  getDivinationPromptTemplate,
  type DivinationPromptMode,
} from "@/lib/ai/divination-prompts";
import { stringifyChart } from "@/lib/divination/normalize";

type DivinationRecord = Database["public"]["Tables"]["divinations"]["Row"];

function buildDivinationPromptInput(record: DivinationRecord) {
  return [
    `${DIVINATION_PROMPT_INPUT_LABELS.divinationType}：${record.divination_type}`,
    `${DIVINATION_PROMPT_INPUT_LABELS.question}：${record.question}`,
    `${DIVINATION_PROMPT_INPUT_LABELS.gender}：${record.gender ?? "unknown"}`,
    `${DIVINATION_PROMPT_INPUT_LABELS.birthGregorian}：${record.birth_gregorian ?? "unknown"}`,
    `${DIVINATION_PROMPT_INPUT_LABELS.chartJson}：`,
    stringifyChart(record.chart_json),
  ].join("\n\n");
}

export function buildDivinationPrompt(
  record: DivinationRecord,
  mode: DivinationPromptMode = "full",
) {
  const template = getDivinationPromptTemplate(record.divination_type, mode);

  return {
    system: template.system,
    prompt: buildDivinationPromptInput(record),
  };
}
