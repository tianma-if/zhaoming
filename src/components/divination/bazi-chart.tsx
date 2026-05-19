import type { BaziChart } from "@/types/divination";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";

const coreInfoLabels = new Set([
  "输入时间",
  "排盘时间",
  "农历",
  "出生地",
  "时区",
  "经度修正",
  "生肖",
]);

export function BaziChartView({ chart }: { chart: BaziChart }) {
  const view = getBaziViewModel(chart);
  const baziText = view.pillars.map((pillar) => pillar.ganZhi).join(" ");
  const coreSummary = view.summary.filter((item) => coreInfoLabels.has(item.label));
  const derivedSummary = view.summary.filter((item) => !coreInfoLabels.has(item.label));

  return (
    <div className="space-y-6">
      <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl tracking-[0.04em]">基本信息</CardTitle>
            <CardDescription className="text-base text-foreground">
              八字：{baziText}
            </CardDescription>
          </div>
          <Badge>排盘结果</Badge>
        </div>

        <dl className="grid gap-x-8 gap-y-4 text-sm [grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr))]">
          {coreSummary.map((item) => (
            <div key={item.label} className="space-y-1">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="break-words font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>

        {derivedSummary.length > 0 ? (
          <>
            <Separator />
            <dl className="grid gap-x-8 gap-y-4 text-sm [grid-template-columns:repeat(auto-fit,minmax(min(100%,9rem),1fr))]">
              {derivedSummary.map((item) => (
                <div key={item.label} className="space-y-1">
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="break-words font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </Card>

      <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl tracking-[0.04em]">八字详解</CardTitle>
            <CardDescription>
              八字的每一柱都由天干和地支组成，每一柱都有其特定的五行属性。
            </CardDescription>
          </div>
          <Badge>{baziText}</Badge>
        </div>

        <div className="grid gap-6 text-center [grid-template-columns:repeat(auto-fit,minmax(min(100%,8.5rem),1fr))]">
          {view.pillars.map((pillar) => (
            <article key={pillar.key} className="space-y-3">
              <p className="text-sm text-muted-foreground">{pillar.label}</p>
              <p className="font-display text-3xl">{pillar.ganZhi}</p>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-center gap-1.5">
                  <dt className="text-muted-foreground">天干五行：</dt>
                  <dd className="font-medium">{pillar.elements[0]}</dd>
                </div>
                <div className="flex justify-center gap-1.5">
                  <dt className="text-muted-foreground">地支五行：</dt>
                  <dd className="font-medium">{pillar.elements[1]}</dd>
                </div>
              </dl>
              <div className="text-xs text-muted-foreground">
                {pillar.shiShenGan} · {pillar.naYin}
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
