"use client";

import { useMemo } from "react";
import { DashboardSection } from "@/components/layout/dashboard-shell";
import { CopyContentButton } from "@/components/divination/copy-content-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { QimenPalace, SanshiChart } from "@/types/divination";

function MetaList({
  items,
  columns = "md:grid-cols-2 xl:grid-cols-4",
}: {
  items: Array<{ label: string; value: string; detail?: string }>;
  columns?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-3 rounded-[1.25rem] border border-border/70 bg-muted/15 px-4 py-4",
        columns,
      )}
    >
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
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
          <p
            className={cn(
              "text-xs uppercase tracking-[0.2em]",
              accent ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {palace.direction}
          </p>
          <h3 className="mt-1 font-display text-2xl tracking-[0.04em]">{palace.palace}</h3>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {palace.isChiefDeity ? (
            <Badge className="border-white/20 bg-white/15 text-white">值符</Badge>
          ) : null}
          {palace.isChiefStar ? (
            <Badge className={accent ? "border-white/20 bg-white/15 text-white" : ""}>
              值星
            </Badge>
          ) : null}
          {palace.isDutyDoor ? (
            <Badge className={accent ? "border-white/20 bg-white/15 text-white" : ""}>
              值使
            </Badge>
          ) : null}
        </div>
      </div>

      <div className={cn("mt-4 space-y-2 text-sm", accent ? "text-white/88" : "text-foreground")}>
        <p>地盘: {palace.earthStem}</p>
        <p>天盘: {palace.heavenStem ?? "中寄"}</p>
        <p>九星: {palace.star ?? "无"}</p>
        <p>八门: {palace.door ?? "中宫无门"}</p>
        <p>八神: {palace.deity ?? "无"}</p>
      </div>
    </article>
  );
}

function formatQimenCopyText(chart: SanshiChart) {
  if (!chart.qimen) return "";

  return [
    `问题：${chart.meta.question}`,
    `起局时间：${chart.meta.divinationDateTime}`,
    `干支：${chart.meta.ganZhi}`,
    `时旬与旬空：${chart.meta.xun} / ${chart.meta.xunKong}`,
    `盘面信息：${chart.qimen.dunLabel}${chart.qimen.ju}局 / 值符${chart.qimen.chiefDeity} / 值星${chart.qimen.chiefStar} / 值使${chart.qimen.dutyDoor} / 值使落宫${chart.qimen.dutyPalace}`,
    "九宫盘：",
    ...chart.qimen.palaces.map(
      (palace) =>
        `${palace.palace}(${palace.direction})：地盘${palace.earthStem} / 天盘${palace.heavenStem ?? "中寄"} / ${palace.star ?? "无星"} / ${palace.door ?? "无门"} / ${palace.deity ?? "无神"}`,
    ),
  ].join("\n");
}

export function SanshiChartView({ chart }: { chart: SanshiChart }) {
  const copyText = useMemo(() => formatQimenCopyText(chart), [chart]);

  if (chart.meta.system !== "qimen" || !chart.qimen) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardSection className="space-y-6" title="奇门盘面">
        <MetaList
          columns="xl:grid-cols-[1.2fr_1fr]"
          items={[
            {
              label: "盘面信息",
              value: `${chart.qimen.dunLabel}${chart.qimen.ju}局 · 值符${chart.qimen.chiefDeity} · 值使${chart.qimen.dutyDoor}`,
              detail: `${chart.qimen.dayGanZhi}日 · ${chart.qimen.timeGanZhi}时 · 旬空 ${chart.qimen.hourVoid}`,
            },
            {
              label: "问题",
              value: chart.meta.question,
              detail: `${chart.meta.topicLabel} · ${chart.meta.systemLabel}`,
            },
          ]}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {chart.qimen.palaces.map((palace) => (
            <QimenPalaceCell key={palace.index} palace={palace} />
          ))}
        </div>

        <div className="flex justify-end">
          <CopyContentButton label="复制盘面概要" text={copyText} />
        </div>
      </DashboardSection>
    </div>
  );
}
