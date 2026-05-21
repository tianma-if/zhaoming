import type { LiuyaoChart } from "@/types/divination";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

function formatMethod(method: LiuyaoChart["meta"]["method"]) {
  return method === "coins" ? "铜钱摇卦" : "手动录入";
}

export function LiuyaoChartView({ chart }: { chart: LiuyaoChart }) {
  const linesTopDown = chart.lines.slice().reverse();

  return (
    <div className="space-y-6">
      <Card className="space-y-6 rounded-[1.8rem] border border-border bg-white p-6 shadow-none">
        <section className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">Liuyao Overview</p>
              <CardTitle className="text-4xl tracking-[0.04em]">
                {chart.originalHexagram.name}
                <span className="ml-3 text-xl text-muted-foreground">
                  {chart.originalHexagram.upperTrigram}上{chart.originalHexagram.lowerTrigram}下
                </span>
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-8">
                {chart.originalHexagram.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full bg-muted/30 px-3 py-1">
              {formatMethod(chart.meta.method)}
            </Badge>
          </div>

          <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <p>起卦时间：{chart.meta.divinationDateTime}</p>
            <p>农历：{chart.meta.lunar}</p>
            <p>干支：{chart.meta.ganZhi}</p>
            <p>
              动爻：
              {chart.movingLineIndexes.length
                ? chart.movingLineIndexes.map((index) => chart.lines[index - 1]?.label).join("、")
                : "无"}
            </p>
          </div>
        </section>

        <div className="h-px bg-border/70" />

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="space-y-4 rounded-[1.5rem] border border-border bg-muted/15 p-5">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">本卦</p>
              <h3 className="text-3xl tracking-[0.04em] text-foreground">{chart.originalHexagram.name}</h3>
            </div>
            <div className="space-y-2 font-mono text-lg text-foreground">
              {linesTopDown.map((line) => (
                <div key={`original-${line.index}`} className="flex items-center justify-between gap-4">
                  <span>{line.symbol}</span>
                  <span className="min-w-12 text-right text-xs text-muted-foreground">
                    {line.label}
                    {line.isMoving ? " 动" : ""}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="space-y-4 rounded-[1.5rem] border border-border bg-muted/15 p-5">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">变卦</p>
              <h3 className="text-3xl tracking-[0.04em] text-foreground">{chart.changedHexagram.name}</h3>
            </div>
            <div className="space-y-2 font-mono text-lg text-foreground">
              {linesTopDown.map((line) => (
                <div key={`changed-${line.index}`} className="flex items-center justify-between gap-4">
                  <span>{line.changedSymbol}</span>
                  <span className="min-w-12 text-right text-xs text-muted-foreground">{line.label}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </Card>

      <Card className="space-y-6 rounded-[1.8rem] border border-border bg-white p-6 shadow-none">
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[0.04em]">解读提示</CardTitle>
          <CardDescription className="text-base leading-8">
            当前版本提供的是六爻基础起卦结果，会围绕本卦、动爻与变卦来帮助你理解问题走势；完整纳甲、六亲、六神等专业层后续再继续补充。
          </CardDescription>
        </div>

        {chart.meta.notes ? (
          <div className="rounded-[1.35rem] border border-border bg-muted/20 p-4">
            <p className="text-sm font-medium text-foreground">补充背景</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{chart.meta.notes}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
