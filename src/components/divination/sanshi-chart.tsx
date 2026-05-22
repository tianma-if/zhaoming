import { Sparkles } from "lucide-react";
import { DashboardSection } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { QimenPalace, SanshiChart } from "@/types/divination";

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

function MetaList({
  items,
  columns = "md:grid-cols-2 xl:grid-cols-4",
}: {
  items: Array<{ label: string; value: string; detail?: string }>;
  columns?: string;
}) {
  return (
    <div className={cn("grid gap-x-6 gap-y-3 rounded-[1.25rem] border border-border/70 bg-muted/15 px-4 py-4", columns)}>
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="space-y-1"
        >
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {item.label}
          </p>
          <p className="text-base font-semibold tracking-[0.01em] text-foreground">
            {item.value}
          </p>
          {item.detail ? (
            <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function getQimenCellTone(palace: QimenPalace) {
  if (palace.isDutyDoor || palace.isChiefStar || palace.isChiefDeity) {
    return "border-black/20 bg-black text-white";
  }

  if (palace.door === "生门" || palace.door === "开门" || palace.door === "休门") {
    return "border-emerald-200 bg-emerald-50";
  }

  if (palace.door === "死门" || palace.door === "惊门") {
    return "border-rose-200 bg-rose-50";
  }

  return "border-border/70 bg-white";
}

function QimenPalaceCell({ palace }: { palace: QimenPalace }) {
  const accent = palace.isDutyDoor || palace.isChiefStar || palace.isChiefDeity;

  return (
    <article
      className={cn(
        "min-h-[190px] rounded-[1.4rem] border p-4 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]",
        getQimenCellTone(palace),
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-xs tracking-[0.2em] uppercase", accent ? "text-white/70" : "text-muted-foreground")}>
            {palace.direction}
          </p>
          <h3 className="mt-1 font-display text-2xl tracking-[0.04em]">{palace.palace}</h3>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {palace.isChiefDeity ? <Badge className="border-white/20 bg-white/15 text-white">值符</Badge> : null}
          {palace.isChiefStar ? (
            <Badge className={accent ? "border-white/20 bg-white/15 text-white" : ""}>值星</Badge>
          ) : null}
          {palace.isDutyDoor ? (
            <Badge className={accent ? "border-white/20 bg-white/15 text-white" : ""}>值使</Badge>
          ) : null}
        </div>
      </div>

      <div className={cn("mt-4 space-y-2 text-sm", accent ? "text-white/88" : "text-foreground")}>
        <p>地盘：{palace.earthStem}</p>
        <p>天盘：{palace.heavenStem ?? "中寄"}</p>
        <p>九星：{palace.star ?? "无"}</p>
        <p>八门：{palace.door ?? "中宫无门"}</p>
        <p>八神：{palace.deity ?? "无"}</p>
      </div>
    </article>
  );
}

function QimenBoardSection({ chart }: { chart: SanshiChart }) {
  if (!chart.qimen) {
    return null;
  }

  return (
    <DashboardSection
      className="space-y-6"
      title="奇门盘面"
      description="这一层先把盘立起来，再往下看值符值使、门星神和宫位之间的关系。当前为产品化简化盘面，但已经具备可读的九宫结构。"
    >
      <MetaList
        columns="md:grid-cols-2 xl:grid-cols-5"
        items={[
          {
            label: "遁局",
            value: `${chart.qimen.dunLabel}${chart.qimen.ju}局`,
            detail: `${chart.qimen.dayGanZhi}日 · ${chart.qimen.timeGanZhi}时`,
          },
          {
            label: "值符",
            value: chart.qimen.chiefDeity,
            detail: `主星 ${chart.qimen.chiefStar}`,
          },
          {
            label: "值使",
            value: chart.qimen.dutyDoor,
            detail: `落宫 ${chart.qimen.dutyPalace}`,
          },
          {
            label: "旬空",
            value: chart.qimen.hourVoid,
            detail: `${chart.meta.xun} / ${chart.meta.xunKong}`,
          },
          {
            label: "起局主题",
            value: chart.meta.topicLabel,
            detail: chart.meta.systemLabel,
          },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {chart.qimen.palaces.map((palace) => (
          <QimenPalaceCell key={palace.index} palace={palace} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {chart.qimen.summary.map((item) => (
          <div
            key={item}
            className="rounded-[1.25rem] border border-border/70 bg-muted/20 px-4 py-4 text-sm leading-7 text-foreground"
          >
            {item}
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}

export function SanshiChartView({ chart }: { chart: SanshiChart }) {
  return (
    <div className="space-y-6">
      <DashboardSection
        className="space-y-5"
        title={`${chart.meta.systemLabel}结果`}
        description={
          chart.meta.system === "qimen"
            ? "当前结果同时包含奇门盘面层与摘要层，适合先看九宫结构，再看行动建议。"
            : "当前页面展示的是适合产品内使用的三式摘要，重点帮助你看时机、策略、协同与风险。"
        }
      >
        <MetaList
          items={[
            {
              label: "所用流派",
              value: chart.meta.systemLabel,
              detail: `主题：${chart.meta.topicLabel}`,
            },
            {
              label: "起局时间",
              value: chart.meta.divinationDateTime,
              detail: chart.meta.lunar,
            },
            {
              label: "干支与旬",
              value: chart.meta.ganZhi,
              detail: `${chart.meta.xun} / ${chart.meta.xunKong}`,
            },
            {
              label: "求测人",
              value: chart.meta.subjectName,
              detail: `性别：${chart.meta.gender}`,
            },
          ]}
        />

        <div className="rounded-[1.25rem] border border-border/70 bg-muted/20 px-4 py-3">
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">问题</p>
          <p className="mt-1 text-sm leading-7 text-foreground">{chart.meta.question}</p>
        </div>
      </DashboardSection>

      {chart.meta.system === "qimen" ? <QimenBoardSection chart={chart} /> : null}

      <DashboardSection
        className="space-y-5"
        title="结构化信号"
        description="这些字段来自起局时间与盘面摘要整理，适合用来支撑 AI 后续解读。"
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
        description="这一层把盘面信息收束成更容易执行的决策语言。"
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
        <DashboardSection className="space-y-5" title="行动建议">
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

        <DashboardSection className="space-y-5" title="风险提醒">
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

      <DashboardSection className="space-y-4 border-dashed bg-muted/25" title="结果边界">
        <p className="text-sm leading-8 text-muted-foreground">{chart.disclaimer}</p>
        <div className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-muted-foreground uppercase">
          <Sparkles className="size-4" />
          建议结合 AI 解读继续展开
        </div>
      </DashboardSection>
    </div>
  );
}
