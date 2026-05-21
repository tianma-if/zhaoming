import { Solar } from "lunar-typescript";
import type { LiuyaoChart, LiuyaoLine, LiuyaoLineValue } from "@/types/divination";
import type { LiuyaoInput } from "../schemas";
import { getHexagramByLines } from "../liuyao-hexagrams";

const LINE_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;

function formatLine(value: LiuyaoLineValue, index: number): LiuyaoLine {
  const isYang = value === 7 || value === 9;
  const isMoving = value === 6 || value === 9;
  const changedYang = value === 6 || value === 7;

  return {
    index: index + 1,
    label: LINE_LABELS[index]!,
    value,
    yinYang: isYang ? "yang" : "yin",
    isMoving,
    symbol: isYang ? "────────" : "────  ────",
    changedSymbol: changedYang ? "────────" : "────  ────",
  };
}

function getRandomLineValue(): LiuyaoLineValue {
  const first = Math.random() < 0.5 ? 2 : 3;
  const second = Math.random() < 0.5 ? 2 : 3;
  const third = Math.random() < 0.5 ? 2 : 3;

  return (first + second + third) as LiuyaoLineValue;
}

export function createCoinGeneratedLines(): LiuyaoLineValue[] {
  return Array.from({ length: 6 }, () => getRandomLineValue());
}

export function buildLiuyaoChart(input: LiuyaoInput): {
  chart: LiuyaoChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
} {
  const lineValues = input.lineValues as LiuyaoLineValue[];
  const baseLines = lineValues.map((value) => (value === 7 || value === 9 ? 1 : 0));
  const changedLines = lineValues.map((value) =>
    value === 6 ? 1 : value === 9 ? 0 : value === 7 ? 1 : 0,
  );
  const lines = lineValues.map((value, index) => formatLine(value, index));
  const movingLineIndexes = lines.filter((line) => line.isMoving).map((line) => line.index);
  const originalHexagram = getHexagramByLines(baseLines);
  const changedHexagram = getHexagramByLines(changedLines);
  const [year, month, day] = input.divinationDate.split("-").map(Number);
  const [hour, minute] = input.divinationTime.split(":").map(Number);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const dateTimeText = `${input.divinationDate} ${input.divinationTime}:00`;
  const ganZhi = `${lunar.getYearInGanZhiExact()}年 ${lunar.getMonthInGanZhiExact()}月 ${lunar.getDayInGanZhiExact()}日 ${lunar.getTimeInGanZhi()}时`;

  return {
    chart: {
      kind: "liuyao",
      meta: {
        method: input.method,
        divinationDateTime: dateTimeText,
        lunar: lunar.toString(),
        ganZhi,
        question: input.question,
        subjectName: input.subjectName,
        gender: input.gender,
        notes: input.notes || undefined,
      },
      lines,
      movingLineIndexes,
      originalHexagram,
      changedHexagram,
    },
    birthGregorian: dateTimeText,
    birthLunar: {
      label: lunar.toString(),
      ganZhi,
      method: input.method,
      lineValues,
    },
  };
}
