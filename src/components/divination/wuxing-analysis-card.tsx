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
      <div className="mx-auto w-full max-w-[22rem] space-y-3">
        <CardTitle className="text-2xl tracking-[0.04em]">五行分析</CardTitle>

        <p className="text-xs leading-5 text-muted-foreground">
          日主：<span className="font-medium text-foreground">{dayMaster.stem}</span>
          <span className="mx-1.5 text-border">/</span>
          五行：<span className="font-medium text-foreground">{dayMaster.element}</span>
        </p>

        <div className="w-full rounded-[1.1rem] bg-muted/20 p-3">
          <WuxingRadarChart data={radarData} />
        </div>
      </div>
    </Card>
  );
}
