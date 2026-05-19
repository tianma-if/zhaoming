import type { BaziChart } from "@/types/divination";
import { countBaziElements, getBaziDayMaster } from "@/lib/divination/bazi-verdict";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { BaziDaYunAnalysis } from "./bazi-dayun-analysis";
import { BaziShenShaAnalysis } from "./bazi-shensha-analysis";
import { BaziTenGodAnalysis } from "./bazi-ten-god-analysis";
import { WuxingAnalysisCard } from "./wuxing-analysis-card";

const wuxingOrder = ["木", "火", "土", "金", "水"];
const generates: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};
const controls: Record<string, string> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

function getElementRelation(dayElement: string, element: string) {
  if (element === dayElement) {
    return "同我";
  }

  if (generates[element] === dayElement) {
    return "生我";
  }

  if (generates[dayElement] === element) {
    return "我生";
  }

  if (controls[element] === dayElement) {
    return "克我";
  }

  if (controls[dayElement] === element) {
    return "我克";
  }

  return "参考";
}

export function BaziInsights({ chart }: { chart: BaziChart }) {
  const elementCounts = countBaziElements(chart);
  const dayMaster = getBaziDayMaster(chart);
  const view = getBaziViewModel(chart);
  const visibleElementCounts = wuxingOrder.map((element) => ({
    element,
    count: view.pillars.reduce(
      (total, pillar) =>
        total + pillar.elements.filter((pillarElement) => pillarElement === element).length,
      0,
    ),
    relation: getElementRelation(dayMaster.element, element),
  }));

  return (
    <div className="space-y-6">
      <WuxingAnalysisCard
        dayMaster={dayMaster}
        radarData={elementCounts}
        relationData={visibleElementCounts}
      />
      <BaziTenGodAnalysis view={view} />
      <BaziShenShaAnalysis view={view} />
      {view.daYun ? <BaziDaYunAnalysis daYun={view.daYun} /> : null}
    </div>
  );
}
