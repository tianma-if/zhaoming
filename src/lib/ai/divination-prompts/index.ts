import type { DivinationType } from "@/types/divination";
import { BAZI_PROMPT_TEMPLATES } from "./bazi";
import { CHENGGU_PROMPT_TEMPLATES } from "./chenggu";
import { GENERIC_DIVINATION_PROMPT_TEMPLATES } from "./generic";
import { QIMEN_PROMPT_TEMPLATES } from "./qimen";
import type { DivinationPromptMode, DivinationPromptTemplateGroup } from "./types";
import { ZIWEI_PROMPT_TEMPLATES } from "./ziwei";

export { DIVINATION_PROMPT_INPUT_LABELS } from "./common";
export type { DivinationPromptMode } from "./types";

const DIVINATION_PROMPT_REGISTRY: Partial<
  Record<DivinationType, DivinationPromptTemplateGroup>
> = {
  bazi: BAZI_PROMPT_TEMPLATES,
  ziwei: ZIWEI_PROMPT_TEMPLATES,
  qimen: QIMEN_PROMPT_TEMPLATES,
  chenggu: CHENGGU_PROMPT_TEMPLATES,
};

export function getDivinationPromptTemplate(
  divinationType: string,
  mode: DivinationPromptMode,
) {
  const templateGroup =
    DIVINATION_PROMPT_REGISTRY[divinationType as DivinationType] ??
    GENERIC_DIVINATION_PROMPT_TEMPLATES;

  return templateGroup[mode] ?? GENERIC_DIVINATION_PROMPT_TEMPLATES[mode]!;
}
