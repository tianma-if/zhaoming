import type {
  ZiweiChart,
  ZiweiFortunePalace,
  ZiweiPalace,
} from "@/types/divination";

export type ZiweiChartMode = "natal" | "fortune";

const palacePositions = [
  { index: 0, row: 1, col: 1 },
  { index: 1, row: 1, col: 2 },
  { index: 2, row: 1, col: 3 },
  { index: 3, row: 1, col: 4 },
  { index: 4, row: 2, col: 4 },
  { index: 5, row: 3, col: 4 },
  { index: 6, row: 4, col: 4 },
  { index: 7, row: 4, col: 3 },
  { index: 8, row: 4, col: 2 },
  { index: 9, row: 4, col: 1 },
  { index: 10, row: 3, col: 1 },
  { index: 11, row: 2, col: 1 },
] as const;

export interface ZiweiDisplayPalace {
  index: number;
  row: number;
  col: number;
  palace: ZiweiPalace;
  fortune?: ZiweiFortunePalace;
}

export function getZiweiDisplayPalaces(chart: ZiweiChart): ZiweiDisplayPalace[] {
  const cells: ZiweiDisplayPalace[] = [];

  palacePositions.forEach((position) => {
    const palace = chart.palaces.find((item) => item.index === position.index);

    if (!palace) {
      return;
    }

    cells.push({
      ...position,
      palace,
      fortune: chart.fortune?.palaces.find((item) => item.index === palace.index),
    });
  });

  return cells;
}

export function formatZiweiCenterSummary(chart: ZiweiChart, subjectName?: string | null) {
  const lines = [
    subjectName ? `${subjectName}` : "",
    chart.meta.gender === "female" ? "女" : chart.meta.gender === "male" ? "男" : "",
    chart.meta.fiveElementsClass ?? "",
  ].filter(Boolean);

  return {
    title: lines.join(" · "),
    soul: chart.meta.soul ? `命主 ${chart.meta.soul}` : "",
    body: chart.meta.body ? `身主 ${chart.meta.body}` : "",
    palaceLine:
      chart.meta.earthlyBranchOfSoulPalace && chart.meta.earthlyBranchOfBodyPalace
        ? `命宫 ${chart.meta.earthlyBranchOfSoulPalace} · 身宫 ${chart.meta.earthlyBranchOfBodyPalace}`
        : "",
    timeLine: chart.meta.time ? `出生时辰 ${chart.meta.time}` : "",
    solarLine: chart.meta.solar ? `阳历生日 ${chart.meta.solar}` : "",
    lunarLine: chart.meta.lunar ? `农历生日 ${chart.meta.lunar}` : "",
    fortuneLine:
      chart.fortune?.nominalAge && chart.fortune?.targetDate
        ? `当前运势参考 ${chart.fortune.targetDate} · 虚岁 ${chart.fortune.nominalAge}`
        : "",
  };
}

export function formatAgeRange(palace: ZiweiPalace) {
  if (!palace.decadal) return "";

  return `${palace.decadal.startAge}-${palace.decadal.endAge}岁`;
}

export function formatAgesPreview(palace: ZiweiPalace) {
  if (!palace.ages?.length) return "";

  return palace.ages.slice(0, 5).join("、");
}
