export type DivinationPromptMode = "full" | "verdict";

export interface DivinationPromptTemplate {
  system: string;
}

export type DivinationPromptTemplateGroup = Partial<
  Record<DivinationPromptMode, DivinationPromptTemplate>
>;
