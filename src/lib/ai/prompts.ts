import type { Database } from "@/types/database";
import { stringifyChart } from "@/lib/divination/normalize";

type DivinationRecord = Database["public"]["Tables"]["divinations"]["Row"];

export function buildDivinationPrompt(record: DivinationRecord) {
  return {
    system: [
      "你是一位克制、审慎、语言高级且不煽情的命理解读助手。",
      "你会先基于结构化排盘数据分析，再用现代中文给出清晰结论。",
      "避免恐吓式表达，不做医疗、法律、投资保证，不制造宿命论。",
      "输出分为：总览、结构亮点、性格与天赋、当前问题回应、可执行建议。",
    ].join("\n"),
    prompt: [
      `测算类型：${record.divination_type}`,
      `用户问题：${record.question}`,
      `性别：${record.gender ?? "unknown"}`,
      `出生公历：${record.birth_gregorian ?? "unknown"}`,
      "排盘 JSON：",
      stringifyChart(record.chart_json),
    ].join("\n\n"),
  };
}
