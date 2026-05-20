import { countBaziElements, getBaziDayMaster } from "@/lib/divination/bazi-verdict";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { stringifyChart } from "@/lib/divination/normalize";
import type { Database } from "@/types/database";
import type { BaziChart, ZiweiChart, ZiweiPalace } from "@/types/divination";

type DivinationRecord = Database["public"]["Tables"]["divinations"]["Row"];

function formatBasicInfo(record: DivinationRecord) {
  return [
    `测算类型：${record.divination_type}`,
    `用户问题：${record.question}`,
    `性别：${record.gender ?? "unknown"}`,
    `出生公历：${record.birth_gregorian ?? "unknown"}`,
  ].join("\n");
}

function formatBaziSummary(chart: BaziChart) {
  const dayMaster = getBaziDayMaster(chart);
  const elements = countBaziElements(chart)
    .map(({ element, count }) => `${element}${count}`)
    .join("、");
  const pillars = chart.pillars.map((pillar) => `${pillar.label}${pillar.ganZhi}`).join(" / ");
  const view = getBaziViewModel(chart);
  const currentDaYun = view.daYun?.current
    ? `${view.daYun.current.ageRange}，${view.daYun.current.ganZhi}（${view.daYun.current.tenGod || "未标注十神"}）`
    : "未计算出当前大运";
  const summaryFields = view.summary
    .filter((item) => ["农历", "生肖", "命宫", "身宫", "胎元"].includes(item.label))
    .map((item) => `${item.label}：${item.value}`)
    .join("\n");
  const shenShaHighlights = view.shenSha
    .slice(0, 2)
    .map((group) => `${group.label}：${group.values.slice(0, 4).join("、")}`)
    .join("\n");

  return [
    `四柱：${pillars}`,
    `日主：${dayMaster.stem}${dayMaster.element}`,
    `五行统计：${elements}`,
    summaryFields,
    `当前大运：${currentDaYun}`,
    shenShaHighlights ? `补充线索：\n${shenShaHighlights}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function summarizeZiweiPalace(palace: ZiweiPalace | undefined, label: string) {
  if (!palace) {
    return `${label}：未找到对应宫位`;
  }

  const majorStars = palace.majorStars.length ? palace.majorStars.join("、") : "无主星";
  const minorStars = palace.minorStars.slice(0, 4).join("、");

  return [
    `${label}：${palace.name}（${palace.heavenlyStem}${palace.earthlyBranch}）`,
    `主星：${majorStars}`,
    minorStars ? `辅星：${minorStars}` : "",
    palace.changsheng12 ? `长生十二神：${palace.changsheng12}` : "",
  ]
    .filter(Boolean)
    .join("；");
}

function formatZiweiSummary(chart: ZiweiChart) {
  const mingPalace = chart.palaces.find((palace) => palace.name === "命宫");
  const shenPalace =
    chart.palaces.find((palace) => palace.name === "身宫") ??
    (mingPalace ? chart.palaces[(chart.palaces.indexOf(mingPalace) + 6) % chart.palaces.length] : undefined);
  const topPalaces = chart.palaces
    .filter((palace) => palace.majorStars.length > 0)
    .slice(0, 4)
    .map((palace) => `${palace.name}：${palace.majorStars.join("、")}`)
    .join("\n");

  return [
    `农历：${chart.meta.lunar}`,
    `中文日期：${chart.meta.chineseDate}`,
    `生肖：${chart.meta.zodiac}`,
    summarizeZiweiPalace(mingPalace, "命宫重点"),
    summarizeZiweiPalace(shenPalace, "身宫重点"),
    topPalaces ? `主星分布摘录：\n${topPalaces}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function formatGenericSummary(record: DivinationRecord) {
  return [
    `当前记录状态：${record.status}`,
    `测算类型：${record.divination_type}`,
    `问题：${record.question}`,
  ].join("\n");
}

function formatDerivedSummary(record: DivinationRecord) {
  if (record.divination_type === "bazi") {
    return formatBaziSummary(record.chart_json as unknown as BaziChart);
  }

  if (record.divination_type === "ziwei") {
    return formatZiweiSummary(record.chart_json as unknown as ZiweiChart);
  }

  return formatGenericSummary(record);
}

export function buildDivinationPromptInput(record: DivinationRecord) {
  return [
    "[基础信息]",
    formatBasicInfo(record),
    "",
    "[程序提炼摘要]",
    formatDerivedSummary(record),
    "",
    "[完整排盘 JSON（附录）]",
    stringifyChart(record.chart_json),
  ].join("\n");
}
