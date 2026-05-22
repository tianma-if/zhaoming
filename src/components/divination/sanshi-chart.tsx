import { Sparkles } from "lucide-react";
import { DashboardMetricCard, DashboardSection } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import type { SanshiChart } from "@/types/divination";

const toneClassMap = {
  favorable: "border-emerald-200 bg-emerald-50 text-emerald-700",
  neutral: "border-amber-200 bg-amber-50 text-amber-700",
  cautious: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

const toneLabelMap = {
  favorable: "可推进",
  neutral: "先校正",
  cautious: "宜谨慎",
} as const;

export function SanshiChartView({ chart }: { chart: SanshiChart }) {
  return (
    <div className="space-y-6">
      <DashboardSection
        className="space-y-5"
        title={`${chart.meta.systemLabel}简化局面`}
        description="当前页面展示的是适合产品内使用的三式摘要，重点帮助你看时机、策略、协同与风险。"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardMetricCard
            label="所用流派"
            value={chart.meta.systemLabel}
            detail={`主题：${chart.meta.topicLabel}`}
          />
          <DashboardMetricCard
            label="起局时间"
            value={chart.meta.divinationDateTime}
            detail={chart.meta.lunar}
          />
          <DashboardMetricCard
            label="干支与旬"
            value={chart.meta.ganZhi}
            detail={`${chart.meta.xun} / ${chart.meta.xunKong}`}
          />
          <DashboardMetricCard
            label="求测人"
            value={chart.meta.subjectName}
            detail={`性别：${chart.meta.gender}`}
          />
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-muted/25 p-5">
          <p className="text-sm leading-8 text-foreground">{chart.meta.question}</p>
          {chart.meta.notes ? (
            <p className="mt-3 border-t border-border/60 pt-3 text-sm leading-7 text-muted-foreground">
              补充背景：{chart.meta.notes}
            </p>
          ) : null}
        </div>
      </DashboardSection>

      <DashboardSection
        className="space-y-5"
        title="结构化信号"
        description="这些字段来自起局时间与简化规则整理，适合用来支撑 AI 后续解读。"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {chart.signals.map((signal) => (
            <article
              key={signal.label}
              className="rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.16)]"
            >
              <div className="space-y-2">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  {signal.label}
                </p>
                <p className="font-display text-3xl tracking-[0.03em]">{signal.value}</p>
                {signal.hint ? (
                  <p className="text-sm leading-7 text-muted-foreground">{signal.hint}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        className="space-y-5"
        title="四个判断维度"
        description="这一步把盘面的信息收束成更容易执行的决策语言。"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {chart.sectors.map((sector) => (
            <article
              key={sector.key}
              className="rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.16)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <h3 className="font-display text-3xl tracking-[0.04em]">{sector.label}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{sector.summary}</p>
                </div>
                <Badge className={toneClassMap[sector.tone]}>{toneLabelMap[sector.tone]}</Badge>
              </div>
              <div className="mt-4 rounded-2xl bg-muted/35 p-4 text-sm leading-7 text-foreground">
                {sector.action}
              </div>
            </article>
          ))}
        </div>
      </DashboardSection>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardSection
          className="space-y-5"
          title="行动建议"
        >
          <div className="space-y-3">
            {chart.advice.map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-border/70 bg-white px-4 py-3 text-sm leading-7"
              >
                {item}
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          className="space-y-5"
          title="风险提醒"
        >
          <div className="space-y-3">
            {chart.caution.map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-900"
              >
                {item}
              </div>
            ))}
          </div>
        </DashboardSection>
      </div>

      <DashboardSection
        className="space-y-4 border-dashed bg-muted/25"
        title="结果边界"
      >
        <p className="text-sm leading-8 text-muted-foreground">{chart.disclaimer}</p>
        <div className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-muted-foreground uppercase">
          <Sparkles className="size-4" />
          建议结合 AI 解读继续展开
        </div>
      </DashboardSection>
    </div>
  );
}
