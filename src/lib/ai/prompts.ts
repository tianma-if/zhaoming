import type { Database } from "@/types/database";
import {
  getDivinationPromptTemplate,
  type DivinationPromptMode,
} from "@/lib/ai/divination-prompts";
import { buildDivinationPromptInput } from "@/lib/ai/divination-prompt-input";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";

type DivinationRecord = Database["public"]["Tables"]["divinations"]["Row"];

export function buildDivinationPrompt(
  record: DivinationRecord,
  mode: DivinationPromptMode = "full",
) {
  const template = getDivinationPromptTemplate(resolveDivinationTypeFromRecord(record), mode);

  return {
    system: template.system,
    prompt: buildDivinationPromptInput(record),
  };
}
