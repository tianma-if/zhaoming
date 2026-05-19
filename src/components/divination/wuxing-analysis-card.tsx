import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WuxingBadge } from "./wuxing-badge";
import { WuxingRadarChart, type WuxingRadarDatum } from "./wuxing-radar-chart";

export interface WuxingRelationDatum {
  element: string;
  count: number;
  relation: string;
}

export function WuxingAnalysisCard({
  dayMaster,
  relationData,
  radarData,
}: {
  dayMaster: {
    stem: string;
    element: string;
  };
  relationData: WuxingRelationDatum[];
  radarData: WuxingRadarDatum[];
}) {
  return (
    <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white shadow-none">
      <div className="space-y-2">
        <CardTitle className="text-3xl tracking-[0.04em]">五行分析</CardTitle>
        <CardDescription className="text-sm leading-7">五行分布与关系</CardDescription>
      </div>
      <Separator />
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.1rem] border border-border bg-muted/35 p-4">
          <div className="flex items-end gap-3">
            <span className="font-display text-4xl">{dayMaster.stem}</span>
            <span className="pb-1 text-sm text-muted-foreground">日主</span>
            <WuxingBadge element={dayMaster.element} />
          </div>
          <Badge>五行分布与关系</Badge>
        </div>

        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,10rem),1fr))]">
          {relationData.map((item) => (
            <div key={item.element} className="space-y-2 rounded-[1.1rem] bg-muted/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-3xl">{item.element}</p>
                <Badge className="bg-white">{item.relation}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.count} 个</p>
            </div>
          ))}
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
