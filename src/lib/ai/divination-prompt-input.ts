import { countBaziElements, getBaziDayMaster } from "@/lib/divination/bazi-verdict";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import type { Database } from "@/types/database";
import type {
  BaziChart,
  ChengguChart,
  LiuyaoChart,
  SanshiChart,
  ZiweiChart,
  ZiweiPalace,
} from "@/types/divination";

type DivinationRecord = Database["public"]["Tables"]["divinations"]["Row"];

const divinationTypeLabels: Record<string, string> = {
  bazi: "八字",
  ziwei: "紫微斗数",
  qimen: "奇门遁甲",
  meihua: "梅花易数",
  liuyao: "六爻占卜",
  sanshi: "三式占卜",
  chenggu: "称骨算命",
  custom: "自定义测算",
};

function getDivinationTypeLabel(type: string) {
  return divinationTypeLabels[type] ?? type;
}

function formatBasicInfo(record: DivinationRecord) {
  const divinationType = resolveDivinationTypeFromRecord(record);

  return [
    `测算类型：${getDivinationTypeLabel(divinationType)}`,
    `用户问题：${record.question}`,
    `性别：${record.gender ?? "unknown"}`,
    `公历时间：${record.birth_gregorian ?? "unknown"}`,
  ].join("\n");
}

function formatBaziPromptBasicInfo(record: DivinationRecord, chart: BaziChart) {
  const birthText = chart.meta.lunar
    ? `农历${chart.meta.lunar}${chart.meta.inputSolar ? `，${chart.meta.inputSolar}` : ""}`
    : record.birth_gregorian ?? "unknown";

  return [
    "【基础信息】",
    `• 姓名：${record.subject_name ?? "未提供"}`,
    `• 生辰：${birthText}`,
    `• 性别：${record.gender === "male" ? "男" : record.gender === "female" ? "女" : record.gender ?? "未提供"}`,
    `• 出生地：${(chart.meta.birthPlace ?? "未提供").replaceAll(", ", "")}`,
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
    ? `${view.daYun.current.ageRange}，${view.daYun.current.ganZhi}，${view.daYun.current.tenGod || "未标注十神"}`
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

function formatChengguSummary(chart: ChengguChart) {
  const breakdown = chart.weights
    .map((item) => `${item.label}：${item.source}，${item.display}`)
    .join("\n");

  return [
    `农历：${chart.meta.lunar}`,
    `总骨重：${chart.totalText}`,
    `结构拆分：\n${breakdown}`,
    `歌诀：${chart.verdict}`,
    `总结：${chart.summary}`,
  ].join("\n");
}

function formatLiuyaoSummary(chart: LiuyaoChart) {
  const lineSummary = chart.lines
    .slice()
    .reverse()
    .map((line) => `${line.label}：${line.value}${line.isMoving ? "（动）" : ""}`)
    .join("\n");
  const movingLines =
    chart.movingLineIndexes.length > 0
      ? chart.movingLineIndexes
          .map((index) => chart.lines[index - 1]?.label ?? `${index}爻`)
          .join("、")
      : "无动爻";

  return [
    `起卦时间：${chart.meta.divinationDateTime}`,
    `干支：${chart.meta.ganZhi}`,
    `农历：${chart.meta.lunar}`,
    `本卦：${chart.originalHexagram.name}（${chart.originalHexagram.upperTrigram}上${chart.originalHexagram.lowerTrigram}下）`,
    `变卦：${chart.changedHexagram.name}（${chart.changedHexagram.upperTrigram}上${chart.changedHexagram.lowerTrigram}下）`,
    `动爻：${movingLines}`,
    `六爻数值：\n${lineSummary}`,
    chart.meta.notes ? `补充信息：${chart.meta.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function formatSanshiSummary(chart: SanshiChart) {
  const signalSummary = chart.signals
    .map((signal) => `${signal.label}：${signal.value}${signal.hint ? `（${signal.hint}）` : ""}`)
    .join("\n");
  const sectorSummary = chart.sectors
    .map((sector) => `${sector.label}【${sector.tone}】：${sector.summary}；建议：${sector.action}`)
    .join("\n");

  return [
    `所用流派：${chart.meta.systemLabel}`,
    `问题主题：${chart.meta.topicLabel}`,
    `起局时间：${chart.meta.divinationDateTime}`,
    `干支：${chart.meta.ganZhi}`,
    `旬与旬空：${chart.meta.xun} / ${chart.meta.xunKong}`,
    `农历：${chart.meta.lunar}`,
    `结构化信号：\n${signalSummary}`,
    `四个判断维度：\n${sectorSummary}`,
    `行动建议：${chart.advice.join("；")}`,
    `风险提醒：${chart.caution.join("；")}`,
    `边界说明：${chart.disclaimer}`,
  ].join("\n");
}

function formatGenericSummary(record: DivinationRecord) {
  const divinationType = resolveDivinationTypeFromRecord(record);

  return [
    `当前记录状态：${record.status}`,
    `测算类型：${getDivinationTypeLabel(divinationType)}`,
    `问题：${record.question}`,
  ].join("\n");
}

function formatDerivedSummary(record: DivinationRecord) {
  const divinationType = resolveDivinationTypeFromRecord(record);

  if (divinationType === "bazi") {
    return formatBaziSummary(record.chart_json as unknown as BaziChart);
  }

  if (divinationType === "ziwei") {
    return formatZiweiSummary(record.chart_json as unknown as ZiweiChart);
  }

  if (divinationType === "chenggu") {
    return formatChengguSummary(record.chart_json as unknown as ChengguChart);
  }

  if (divinationType === "liuyao") {
    return formatLiuyaoSummary(record.chart_json as unknown as LiuyaoChart);
  }

  if (divinationType === "sanshi") {
    return formatSanshiSummary(record.chart_json as unknown as SanshiChart);
  }

  return formatGenericSummary(record);
}

export function buildDivinationPromptInput(record: DivinationRecord) {
  const divinationType = resolveDivinationTypeFromRecord(record);

  if (divinationType === "bazi") {
    const chart = record.chart_json as unknown as BaziChart;

    return [
      formatBaziPromptBasicInfo(record, chart),
      "",
      "【命盘关键信息】",
      formatBaziSummary(chart),
    ].join("\n");
  }

  return [
    "[基础信息]",
    formatBasicInfo(record),
    "",
    "[命盘关键信息]",
    formatDerivedSummary(record),
  ].join("\n");
}
