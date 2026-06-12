import { Card, CardTitle } from "@/components/ui/card";
import { WuxingBadge } from "./wuxing-badge";
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

        <div className="inline-flex w-fit max-w-full flex-wrap items-center gap-2.5 rounded-full border border-border bg-muted/25 px-3 py-1.5">
          <span className="font-display text-2xl leading-none">{dayMaster.stem}</span>
          <span className="text-xs text-muted-foreground">日主</span>
          <WuxingBadge element={dayMaster.element} />
        </div>

        <div className="w-full rounded-[1.1rem] bg-muted/20 p-3">
          <WuxingRadarChart data={radarData} />
        </div>
      </div>
    </Card>
  );
}
