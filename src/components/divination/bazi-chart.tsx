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
      <div className="grid gap-4 min-[1400px]:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,11.5rem),1fr))]">
          {view.pillars.map((pillar) => (
            <article
              key={pillar.key}
              className="space-y-3 rounded-[1.1rem] border border-border bg-white p-4"
            >
              <div className="text-xs tracking-[0.28em] text-muted-foreground">
                {pillar.label}
              </div>
              <p className="whitespace-nowrap font-display text-4xl">
                {pillar.heavenlyStem}
                {pillar.earthlyBranch}
              </p>
              <div className="text-sm text-muted-foreground">{pillar.ganZhi}</div>
              <div className="flex flex-wrap gap-2">
                {pillar.elements.map((element, index) => (
                  <WuxingBadge key={`${pillar.key}-${element}-${index}`} element={element} />
                ))}
              </div>
              <Separator />
              <dl className="space-y-2 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <dt className="shrink-0 text-muted-foreground">天干十神</dt>
                  <dd className="min-w-0 text-right break-words">{pillar.shiShenGan}</dd>
                </div>
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <dt className="shrink-0 text-muted-foreground">纳音</dt>
                  <dd className="min-w-0 text-right break-words">{pillar.naYin}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <aside className="space-y-4 rounded-[1.25rem] border border-border bg-muted p-5">
          <div className="text-xs tracking-[0.28em] text-muted-foreground">盘面摘要</div>
          <dl className="space-y-3 text-sm">
            {view.summary.map((item) => (
              <div key={item.label} className="space-y-1">
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="break-words">{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </ChartShell>
  );
}
