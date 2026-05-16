import { Lunar, Solar } from "lunar-typescript";
import type { BaziChart, BaziPillar } from "@/types/divination";
import type { DivinationInput } from "../schemas";

function buildPillar(
  key: BaziPillar["key"],
  label: string,
  values: {
    ganZhi: string;
    heavenlyStem: string;
    earthlyBranch: string;
    hiddenStems: string[];
    naYin: string;
    wuXing: string;
    shiShenGan: string;
    shiShenZhi: string[];
  },
): BaziPillar {
  return {
    key,
    label,
    ...values,
  };
}

export function buildBaziChart(input: DivinationInput): {
  chart: BaziChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
} {
  const [year, month, day] = input.birthDate.split("-").map(Number);
  const [hour, minute] = input.birthTime.split(":").map(Number);

  const lunar =
    input.calendarType === "solar"
      ? Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar()
      : Lunar.fromYmdHms(
          year,
          input.isLeapMonth ? -month : month,
          day,
          hour,
          minute,
          0,
        );

  const solar = lunar.getSolar();
  const eightChar = lunar.getEightChar();

  const pillars: BaziPillar[] = [
    buildPillar("year", "年柱", {
      ganZhi: eightChar.getYear(),
      heavenlyStem: eightChar.getYearGan(),
      earthlyBranch: eightChar.getYearZhi(),
      hiddenStems: eightChar.getYearHideGan(),
      naYin: eightChar.getYearNaYin(),
      wuXing: eightChar.getYearWuXing(),
      shiShenGan: eightChar.getYearShiShenGan(),
      shiShenZhi: eightChar.getYearShiShenZhi(),
    }),
    buildPillar("month", "月柱", {
      ganZhi: eightChar.getMonth(),
      heavenlyStem: eightChar.getMonthGan(),
      earthlyBranch: eightChar.getMonthZhi(),
      hiddenStems: eightChar.getMonthHideGan(),
      naYin: eightChar.getMonthNaYin(),
      wuXing: eightChar.getMonthWuXing(),
      shiShenGan: eightChar.getMonthShiShenGan(),
      shiShenZhi: eightChar.getMonthShiShenZhi(),
    }),
    buildPillar("day", "日柱", {
      ganZhi: eightChar.getDay(),
      heavenlyStem: eightChar.getDayGan(),
      earthlyBranch: eightChar.getDayZhi(),
      hiddenStems: eightChar.getDayHideGan(),
      naYin: eightChar.getDayNaYin(),
      wuXing: eightChar.getDayWuXing(),
      shiShenGan: eightChar.getDayShiShenGan(),
      shiShenZhi: eightChar.getDayShiShenZhi(),
    }),
    buildPillar("time", "时柱", {
      ganZhi: eightChar.getTime(),
      heavenlyStem: eightChar.getTimeGan(),
      earthlyBranch: eightChar.getTimeZhi(),
      hiddenStems: eightChar.getTimeHideGan(),
      naYin: eightChar.getTimeNaYin(),
      wuXing: eightChar.getTimeWuXing(),
      shiShenGan: eightChar.getTimeShiShenGan(),
      shiShenZhi: eightChar.getTimeShiShenZhi(),
    }),
  ];

  return {
    chart: {
      kind: "bazi",
      meta: {
        calendarType: input.calendarType,
        solar: solar.toYmdHms(),
        lunar: lunar.toString(),
        zodiac: lunar.getYearShengXiao(),
        gender: input.gender,
        question: input.question,
        birthPlace: input.birthPlace || undefined,
      },
      pillars,
      derived: {
        taiYuan: eightChar.getTaiYuan(),
        taiXi: eightChar.getTaiXi(),
        mingGong: eightChar.getMingGong(),
        shenGong: eightChar.getShenGong(),
      },
    },
    birthGregorian: solar.toYmdHms(),
    birthLunar: {
      label: lunar.toString(),
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      isLeapMonth: input.isLeapMonth,
    },
  };
}
