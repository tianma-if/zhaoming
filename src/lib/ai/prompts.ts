import type { Database } from "@/types/database";
import {
  getDivinationPromptTemplate,
  type DivinationPromptMode,
} from "@/lib/ai/divination-prompts";
import { buildDivinationPromptInput } from "@/lib/ai/divination-prompt-input";

type DivinationRecord = Database["public"]["Tables"]["divinations"]["Row"];

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
