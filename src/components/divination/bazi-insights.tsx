import type { BaziChart } from "@/types/divination";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { countBaziElements, getBaziDayMaster } from "@/lib/divination/bazi-verdict";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { WuxingBadge } from "./wuxing-badge";

export function BaziInsights({ chart }: { chart: BaziChart }) {
  const elementCounts = countBaziElements(chart);
  const strongest = elementCounts[0];
  const weakest = elementCounts[elementCounts.length - 1];
  const dayMaster = getBaziDayMaster(chart);
  const view = getBaziViewModel(chart);

  return (
    <div className="space-y-6">
      <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="space-y-2">
          <Badge>日主（日元）</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">先看命盘的参照点</CardTitle>
          <CardDescription className="text-sm leading-7">
            日柱天干是观察八字时的核心坐标，后续十神、五行强弱都围绕它展开。
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
              这张盘以后续所有关系判断的起点来看待。
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">较强五行</p>
            <div className="flex items-center gap-2">
              <WuxingBadge element={strongest.element} />
              <span className="text-sm">{strongest.count} 个信号位</span>
            </div>
            <p className="text-sm text-muted-foreground">
              相关性格、行为模式和处事方式更容易被放大。
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">较弱五行</p>
            <div className="flex items-center gap-2">
              <WuxingBadge element={weakest.element} />
              <span className="text-sm">{weakest.count} 个信号位</span>
            </div>
            <p className="text-sm text-muted-foreground">
              这类议题更依赖环境触发，也更适合后天有意识补足。
            </p>
          </div>
        </div>
      </Card>

      <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="space-y-2">
          <Badge>藏干与十神</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">看地支里藏着什么</CardTitle>
          <CardDescription className="text-sm leading-7">
            藏干用于观察每一柱的内在成分，十神则说明这些成分与日主的关系。
          </CardDescription>
        </div>
        <Separator />
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr))]">
          {view.pillars.map((pillar) => (
            <article
              key={pillar.key}
              className="space-y-4 rounded-[1.1rem] border border-border bg-muted/35 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.28em] text-muted-foreground">
                    {pillar.label}
                  </p>
                  <p className="mt-1 font-display text-3xl">{pillar.ganZhi}</p>
                </div>
                <Badge className="shrink-0">{pillar.shiShenGan || "日主"}</Badge>
              </div>
              <dl className="space-y-2 text-sm">
                {pillar.hiddenStemDetails.map((item) => (
                  <div
                    key={`${pillar.key}-${item.stem}-${item.shiShen}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2"
                  >
                    <dt className="font-display text-xl">{item.stem}</dt>
                    <dd className="text-muted-foreground">{item.shiShen || "本气"}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Card>

      <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="space-y-2">
          <Badge>神煞</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">辅助观察的星煞标记</CardTitle>
          <CardDescription className="text-sm leading-7">
            神煞不单独定论，用来补充节奏、取象和事件倾向。
          </CardDescription>
        </div>
        <Separator />
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr))]">
          {view.shenSha.map((group) => (
            <section key={group.label} className="space-y-3">
              <p className="text-xs tracking-[0.28em] text-muted-foreground">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.values.map((item) => (
                  <Badge key={`${group.label}-${item}`} className="bg-muted">
                    {item}
                  </Badge>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}
