import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white">
      <div className="space-y-2">
        <CardTitle className="text-3xl tracking-[0.04em]">五行分析</CardTitle>
        <CardDescription className="text-sm leading-7">五行分布与关系</CardDescription>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="inline-flex w-fit max-w-full flex-wrap items-center gap-3 rounded-full border border-border bg-muted/25 px-4 py-2">
          <span className="font-display text-3xl leading-none">{dayMaster.stem}</span>
          <span className="text-sm text-muted-foreground">日主</span>
          <WuxingBadge element={dayMaster.element} />
        </div>

        <div className="space-y-3 rounded-[1.1rem] bg-muted/20 p-4">
          <p className="font-medium">五行五芒星分布：</p>
          <p className="text-sm text-muted-foreground">
            数量分布仅供参考，需结合日主关系来理解。
          </p>
          <WuxingRadarChart data={radarData} />
        </div>
      </div>
    </Card>
  );
}
