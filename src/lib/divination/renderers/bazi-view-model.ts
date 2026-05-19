import type { BaziChart } from "@/types/divination";
import { Lunar, Solar } from "lunar-typescript";
import { splitWuxing } from "../normalize";

function parseSolarDateTime(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/,
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;

  return Solar.fromYmdHms(
    Number(year),
    Number(month),
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getBaziShenSha(chart: BaziChart) {
  const solar = parseSolarDateTime(chart.meta.solar);

  if (!solar) {
    return [];
  }

  const lunar = Lunar.fromSolar(solar);

  return [
    { label: "吉神宜趋", values: uniq(lunar.getDayJiShen()) },
    { label: "凶煞宜忌", values: uniq(lunar.getDayXiongSha()) },
    {
      label: "天神",
      values: uniq([
        `${lunar.getDayTianShen()}（${lunar.getDayTianShenType()}）`,
        `${lunar.getTimeTianShen()}（${lunar.getTimeTianShenType()}）`,
      ]),
    },
    {
      label: "冲煞",
      values: uniq([lunar.getDayChongDesc(), `煞${lunar.getDaySha()}`]),
    },
  ].filter((group) => group.values.length > 0);
}

export function getBaziViewModel(chart: BaziChart) {
  const pillars = chart.pillars.map((pillar) => ({
    ...pillar,
    elements: splitWuxing(pillar.wuXing),
    hiddenStemDetails: pillar.hiddenStems.map((stem, index) => ({
      stem,
      shiShen: pillar.shiShenZhi?.[index] ?? "",
    })),
  }));

  return {
    pillars,
    shenSha: getBaziShenSha(chart),
    summary: [
      ...(chart.meta.inputSolar && chart.meta.inputSolar !== chart.meta.solar
        ? [{ label: "输入时间", value: chart.meta.inputSolar }]
        : []),
      { label: "排盘时间", value: chart.meta.solar },
      { label: "农历", value: chart.meta.lunar },
      ...(chart.meta.birthPlace ? [{ label: "出生地", value: chart.meta.birthPlace }] : []),
      ...(chart.meta.timezone ? [{ label: "时区", value: chart.meta.timezone }] : []),
      ...(chart.meta.longitudeCorrectionMinutes
        ? [{ label: "经度修正", value: `${chart.meta.longitudeCorrectionMinutes} 分钟` }]
        : []),
      { label: "生肖", value: chart.meta.zodiac },
      { label: "命宫", value: chart.derived.mingGong },
      { label: "身宫", value: chart.derived.shenGong },
      { label: "胎元", value: chart.derived.taiYuan },
    ],
  };
}
