import type { BaziChart } from "@/types/divination";
import { splitWuxing } from "../normalize";

export function getBaziViewModel(chart: BaziChart) {
  return {
    pillars: chart.pillars.map((pillar) => ({
      ...pillar,
      elements: splitWuxing(pillar.wuXing),
    })),
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
