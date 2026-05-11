import type { BaziChart } from "@/types/divination";
import { splitWuxing } from "../normalize";

export function getBaziViewModel(chart: BaziChart) {
  return {
    pillars: chart.pillars.map((pillar) => ({
      ...pillar,
      elements: splitWuxing(pillar.wuXing),
    })),
    summary: [
      { label: "公历", value: chart.meta.solar },
      { label: "农历", value: chart.meta.lunar },
      { label: "生肖", value: chart.meta.zodiac },
      { label: "命宫", value: chart.derived.mingGong },
      { label: "身宫", value: chart.derived.shenGong },
      { label: "胎元", value: chart.derived.taiYuan },
    ],
  };
}
