import type { BaziChart } from "@/types/divination";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { countBaziElements, getBaziDayMaster } from "@/lib/divination/bazi-verdict";
import { WuxingBadge } from "./wuxing-badge";
import { WuxingRadarChart } from "./wuxing-radar-chart";

export function BaziInsights({ chart }: { chart: BaziChart }) {
  const elementCounts = countBaziElements(chart);
  const strongest = elementCounts[0];
  const weakest = elementCounts[elementCounts.length - 1];
  const dayMaster = getBaziDayMaster(chart);

  return (
    <div className="space-y-6">
      <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="space-y-2">
          <Badge>八字概要</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">先看日主与五行倾向</CardTitle>
          <CardDescription className="text-sm leading-7">
            八字阅读的起点通常不是直接下结论，而是先判断日主位置、五行分布和四柱各自承担的层次。
          </CardDescription>
        </div>
        <Separator />
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr))]">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">日主</p>
            <p className="font-display text-4xl">
              {dayMaster.stem}
              <span className="ml-2 text-2xl text-muted-foreground">{dayMaster.element}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              日柱天干是自我核心，决定观察整张命盘时的参照点。
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">较强五行</p>
            <div className="flex items-center gap-2">
              <WuxingBadge element={strongest.element} />
              <span className="text-sm">{strongest.count} 个信号位</span>
            </div>
            <p className="text-sm text-muted-foreground">
              这通常意味着相关性格和行为倾向更容易被放大。
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">较弱五行</p>
            <div className="flex items-center gap-2">
              <WuxingBadge element={weakest.element} />
              <span className="text-sm">{weakest.count} 个信号位</span>
            </div>
            <p className="text-sm text-muted-foreground">
              这类能力或议题往往更需要环境触发，或靠后天补足。
            </p>
          </div>
        </div>
      </Card>

      <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="space-y-2">
          <Badge>五行分布</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">命盘里的结构比例</CardTitle>
        </div>
        <WuxingRadarChart data={elementCounts} />
      </Card>

    </div>
  );
}
