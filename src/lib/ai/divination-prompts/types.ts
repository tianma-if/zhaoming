export type DivinationPromptMode = "full" | "short";

export interface DivinationPromptTemplate {
  system: string;
}

export type DivinationPromptTemplateGroup = Partial<
  Record<DivinationPromptMode, DivinationPromptTemplate>
>;
