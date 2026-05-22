export interface ComparableAiModel {
  id: string;
  label: string;
  vendor: string;
  note: string;
}

export const BAZI_DEMO_MODEL_OPTIONS: ComparableAiModel[] = [
  {
    id: "deepseek/deepseek-v4-pro",
    label: "DeepSeek V4 Pro",
    vendor: "DeepSeek",
    note: "推理强、成本低，但在玄学场景里更容易自动补免责声明。",
  },
  {
    id: "google/gemini-3.1-flash-lite",
    label: "Gemini 3.1 Flash Lite",
    vendor: "Google",
    note: "便宜、速度快，适合看轻量解读和口吻是否发散。",
  },
  {
    id: "google/gemini-3.5-flash",
    label: "Gemini 3.5 Flash",
    vendor: "Google",
    note: "能力更强，通常比 Lite 更完整，也更容易拉长输出。",
  },
];

export function getComparableAiModel(modelId: string) {
  return BAZI_DEMO_MODEL_OPTIONS.find((item) => item.id === modelId) ?? null;
}
