import type { BaziChart } from "@/types/divination";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { BaziBasicInfoCard } from "./bazi-basic-info-card";
import { BaziPillarsInfoCard } from "./bazi-pillars-info-card";

const coreInfoLabels = new Set([
  "输入时间",
  "排盘时间",
  "农历",
  "出生地",
  "时区",
  "经度修正",
  "生肖",
]);

export function BaziChartView({ chart }: { chart: BaziChart }) {
  const view = getBaziViewModel(chart);
  const baziText = view.pillars.map((pillar) => pillar.ganZhi).join(" ");
  const coreSummary = view.summary.filter((item) => coreInfoLabels.has(item.label));
  const derivedSummary = view.summary.filter((item) => !coreInfoLabels.has(item.label));

  return (
    <div className="space-y-6">
      <BaziBasicInfoCard
        baziText={baziText}
        coreSummary={coreSummary}
        derivedSummary={derivedSummary}
      />
      <BaziPillarsInfoCard baziText={baziText} pillars={view.pillars} />
    </div>
  );
}
