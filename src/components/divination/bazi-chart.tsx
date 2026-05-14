import type { BaziChart } from "@/types/divination";
import { Separator } from "@/components/ui/separator";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { WuxingBadge } from "./wuxing-badge";
import { ChartShell } from "./chart-shell";

export function BaziChartView({ chart }: { chart: BaziChart }) {
  const view = getBaziViewModel(chart);

  return (
    <ChartShell
      title="四柱八字"
      description="以无边框排版突出文字关系，不使用传统图表化装饰。"
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {view.pillars.map((pillar) => (
            <article
              key={pillar.key}
              className="space-y-3 rounded-[1.1rem] border border-border/70 bg-white/78 p-4"
            >
              <div className="text-xs tracking-[0.28em] text-muted-foreground">
                {pillar.label}
              </div>
              <div className="space-y-1">
                <p className="font-display text-4xl">{pillar.heavenlyStem}</p>
                <p className="font-display text-3xl text-muted-foreground/90">
                  {pillar.earthlyBranch}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">{pillar.ganZhi}</div>
              <div className="flex flex-wrap gap-2">
                {pillar.elements.map((element) => (
                  <WuxingBadge key={`${pillar.key}-${element}`} element={element} />
                ))}
              </div>
              <Separator />
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">纳音</dt>
                  <dd>{pillar.naYin}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">藏干</dt>
                  <dd>{pillar.hiddenStems.join(" / ")}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <aside className="space-y-4 rounded-[1.25rem] border border-border/70 bg-muted/65 p-5">
          <div className="text-xs tracking-[0.28em] text-muted-foreground">盘面摘要</div>
          <dl className="space-y-3 text-sm">
            {view.summary.map((item) => (
              <div key={item.label} className="space-y-1">
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </ChartShell>
  );
}
