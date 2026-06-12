import { Card, CardTitle } from "@/components/ui/card";
import { WuxingRadarChart, type WuxingRadarDatum } from "./wuxing-radar-chart";

export function WuxingAnalysisCard({
  dayMaster,
  radarData,
}: {
  dayMaster: {
    stem: string;
    element: string;
  };
  radarData: WuxingRadarDatum[];
}) {
  return (
    <Card className="space-y-4 rounded-[1.6rem] border border-border bg-white">
      <div className="space-y-3">
        <CardTitle className="text-2xl tracking-[0.04em]">五行分析</CardTitle>
      </div>

      <WuxingRadarChart
        data={radarData}
        summary={
          <>
            日主：<span className="font-medium text-foreground">{dayMaster.stem}</span>
            <span className="mx-1.5 text-border">/</span>
            五行：<span className="font-medium text-foreground">{dayMaster.element}</span>
          </>
        }
      />
    </Card>
  );
}
