import type { BaziChart } from "@/types/divination";
import { countBaziElements, getBaziDayMaster } from "@/lib/divination/bazi-verdict";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { BaziDaYunAnalysis } from "./bazi-dayun-analysis";
import { BaziShenShaAnalysis } from "./bazi-shensha-analysis";
import { BaziTenGodAnalysis } from "./bazi-ten-god-analysis";
import { WuxingAnalysisCard } from "./wuxing-analysis-card";

export function BaziInsights({ chart }: { chart: BaziChart }) {
  const elementCounts = countBaziElements(chart);
  const dayMaster = getBaziDayMaster(chart);
  const view = getBaziViewModel(chart);

  return (
    <div className="space-y-6">
      <WuxingAnalysisCard dayMaster={dayMaster} radarData={elementCounts} />
      <BaziTenGodAnalysis view={view} />
      <BaziShenShaAnalysis view={view} />
      {view.daYun ? <BaziDaYunAnalysis daYun={view.daYun} /> : null}
    </div>
  );
}
