"use client";

import { useMemo } from "react";
import { DashboardSection } from "@/components/layout/dashboard-shell";
import { CopyContentButton } from "@/components/divination/copy-content-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  QimenPalace,
  SanshiChart,
  SanshiSector,
  TaiyiGodSector,
  TaiyiPalace,
} from "@/types/divination";

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
        "grid gap-x-5 gap-y-2.5 rounded-[1.1rem] border border-border/70 bg-muted/15 px-4 py-3.5",
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

function getTaiyiCellTone(palace: TaiyiPalace) {
  if (palace.markers.includes("太乙")) {
    return "border-black/20 bg-black text-white";
  }

  if (palace.stage === "旺") {
    return "border-emerald-200 bg-emerald-50";
  }

  if (palace.stage === "守") {
    return "border-amber-200 bg-amber-50";
  }

  return "border-border/70 bg-white";
}

function getTaiyiGodTone(sector: TaiyiGodSector) {
  if (sector.markers.includes("太乙")) {
    return "border-black/20 bg-black text-white";
  }

  if (sector.markers.some((item) => item === "文昌" || item === "始击")) {
    return "border-emerald-200 bg-emerald-50";
  }

  if (sector.markers.some((item) => item === "客算" || item === "定算")) {
    return "border-amber-200 bg-amber-50";
  }

  return "border-border/70 bg-white";
}

function getSectorToneStyles(tone: SanshiSector["tone"]) {
  if (tone === "favorable") {
    return {
      card: "border-emerald-200/80 bg-emerald-50/70",
      badge: "border-emerald-200 bg-emerald-100 text-emerald-900",
      label: "顺势",
    };
  }

  if (tone === "cautious") {
    return {
      card: "border-amber-200/80 bg-amber-50/80",
      badge: "border-amber-200 bg-amber-100 text-amber-900",
      label: "谨慎",
    };
  }

  return {
    card: "border-border/70 bg-white",
    badge: "border-border bg-muted/60 text-foreground",
    label: "中性",
  };
}

function QimenPalaceCell({ palace }: { palace: QimenPalace }) {
  const accent = palace.isDutyDoor || palace.isChiefStar || palace.isChiefDeity;

  return (
    <article
      className={cn(
        "min-h-[168px] rounded-[1.15rem] border px-4 py-3.5 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]",
        getQimenCellTone(palace),
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1 pr-2">
          <p
            className={cn(
              "text-xs uppercase tracking-[0.2em]",
              accent ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {palace.direction}
          </p>
          <h3 className="mt-0.5 whitespace-nowrap font-display text-[1.85rem] leading-none tracking-[0.04em]">
            {palace.palace}
          </h3>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
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

      <div
        className={cn("mt-3 space-y-1.5 text-[15px]", accent ? "text-white/88" : "text-foreground")}
      >
        <p>地盘: {palace.earthStem}</p>
        <p>天盘: {palace.heavenStem ?? "中寄"}</p>
        <p>九星: {palace.star ?? "无"}</p>
        <p>八门: {palace.door ?? "中宫无门"}</p>
        <p>八神: {palace.deity ?? "无"}</p>
      </div>
    </article>
  );
}

function TaiyiPalaceCell({ palace }: { palace: TaiyiPalace }) {
  const accent = palace.markers.includes("太乙");

  return (
    <article
      className={cn(
        "min-h-[188px] rounded-[1.15rem] border px-4 py-3.5 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]",
        getTaiyiCellTone(palace),
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1 pr-2">
          <p
            className={cn(
              "text-xs uppercase tracking-[0.2em]",
              accent ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {palace.direction}
          </p>
          <h3 className="mt-0.5 whitespace-nowrap font-display text-[1.85rem] leading-none tracking-[0.04em]">
            {palace.palace}
          </h3>
        </div>
        <Badge
          className={cn(
            accent ? "border-white/20 bg-white/15 text-white" : "",
            palace.stage === "旺" && !accent ? "border-emerald-200 bg-emerald-100 text-emerald-900" : "",
            palace.stage === "守" && !accent ? "border-amber-200 bg-amber-100 text-amber-900" : "",
          )}
        >
          {palace.stage}
        </Badge>
      </div>

      <div className={cn("mt-3 space-y-1.5 text-[15px]", accent ? "text-white/88" : "text-foreground")}>
        <p>宫象: {palace.trigraph}</p>
        <p>标记: {palace.markers.join("、") || "无"}</p>
        <p className={cn("text-sm leading-6", accent ? "text-white/80" : "text-muted-foreground")}>
          {palace.summary}
        </p>
      </div>
    </article>
  );
}

function TaiyiGodSectorCard({ sector }: { sector: TaiyiGodSector }) {
  const accent = sector.markers.includes("太乙");

  return (
    <article
      className={cn(
        "rounded-[1.05rem] border px-3.5 py-3 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]",
        getTaiyiGodTone(sector),
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={cn("text-[11px] uppercase tracking-[0.2em]", accent ? "text-white/70" : "text-muted-foreground")}>
            {sector.branch}
          </p>
          <h4 className="font-semibold">{sector.palace}</h4>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {sector.markers.map((marker) => (
            <Badge
              key={`${sector.index}-${marker}`}
              className={accent ? "border-white/20 bg-white/15 text-white" : ""}
            >
              {marker}
            </Badge>
          ))}
        </div>
      </div>
      <p className={cn("mt-2 text-sm font-medium", accent ? "text-white" : "text-foreground")}>{sector.god}</p>
      <p className={cn("mt-1 text-xs leading-5", accent ? "text-white/80" : "text-muted-foreground")}>
        {sector.elementHint}
      </p>
      <p className={cn("mt-2 text-xs leading-5", accent ? "text-white/80" : "text-muted-foreground")}>
        {sector.summary}
      </p>
    </article>
  );
}

function TaiyiGodSectorCompact({ sector }: { sector: TaiyiGodSector }) {
  const accent = sector.markers.includes("太乙");

  return (
    <article
      className={cn(
        "rounded-xl border px-3 py-2.5 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.24)]",
        getTaiyiGodTone(sector),
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={cn("text-[10px] uppercase tracking-[0.18em]", accent ? "text-white/70" : "text-muted-foreground")}>
            {sector.branch}
          </p>
          <h4 className="text-sm font-semibold">{sector.palace}</h4>
        </div>
        {sector.markers.length ? (
          <Badge className={accent ? "border-white/20 bg-white/15 text-white" : ""}>
            {sector.markers[0]}
          </Badge>
        ) : null}
      </div>
      <p className={cn("mt-1 text-xs font-medium", accent ? "text-white" : "text-foreground")}>{sector.god}</p>
    </article>
  );
}

function TaiyiPalaceCompact({ palace }: { palace: TaiyiPalace }) {
  const accent = palace.markers.includes("太乙");

  return (
    <article
      className={cn(
        "min-h-[116px] rounded-xl border px-3 py-2.5 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.24)]",
        getTaiyiCellTone(palace),
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={cn("text-[10px] uppercase tracking-[0.18em]", accent ? "text-white/70" : "text-muted-foreground")}>
            {palace.direction}
          </p>
          <h4 className="text-sm font-semibold">{palace.palace}</h4>
        </div>
        <Badge
          className={cn(
            accent ? "border-white/20 bg-white/15 text-white" : "",
            palace.stage === "旺" && !accent ? "border-emerald-200 bg-emerald-100 text-emerald-900" : "",
            palace.stage === "守" && !accent ? "border-amber-200 bg-amber-100 text-amber-900" : "",
          )}
        >
          {palace.stage}
        </Badge>
      </div>
      <p className={cn("mt-2 text-xs font-medium", accent ? "text-white" : "text-foreground")}>{palace.trigraph}宫</p>
      <p className={cn("mt-1 text-xs leading-5", accent ? "text-white/80" : "text-muted-foreground")}>
        {palace.markers.join("、") || "无标记"}
      </p>
    </article>
  );
}

function TaiyiCombinedBoard({ chart }: { chart: SanshiChart }) {
  if (!chart.taiyi) return null;

  const branchMap = new Map(chart.taiyi.godSectors.map((sector) => [sector.branch, sector]));
  const ring = [
    { branch: "乾", className: "col-start-1 row-start-1" },
    { branch: "亥", className: "col-start-2 row-start-1" },
    { branch: "子", className: "col-start-3 row-start-1" },
    { branch: "丑", className: "col-start-4 row-start-1" },
    { branch: "艮", className: "col-start-5 row-start-1" },
    { branch: "寅", className: "col-start-5 row-start-2" },
    { branch: "卯", className: "col-start-5 row-start-3" },
    { branch: "辰", className: "col-start-5 row-start-4" },
    { branch: "巽", className: "col-start-5 row-start-5" },
    { branch: "巳", className: "col-start-4 row-start-5" },
    { branch: "午", className: "col-start-3 row-start-5" },
    { branch: "未", className: "col-start-2 row-start-5" },
    { branch: "坤", className: "col-start-1 row-start-5" },
    { branch: "申", className: "col-start-1 row-start-4" },
    { branch: "酉", className: "col-start-1 row-start-3" },
    { branch: "戌", className: "col-start-1 row-start-2" },
  ];
  const innerPalaces = chart.taiyi.palaces
    .slice()
    .sort((a, b) => a.row - b.row || a.col - b.col);

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-[radial-gradient(circle_at_top,_rgba(250,248,244,0.95),_rgba(255,255,255,0.9)_50%,_rgba(248,246,242,0.98))] p-4 shadow-[0_24px_48px_-36px_rgba(22,20,17,0.28)] md:p-5">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-[0.03em] text-foreground">组合盘面</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          外围十六宫看神机与主客动势，内部九宫看落宫后的具体着力点。
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-5 md:grid-rows-5">
        {ring.map(({ branch, className }) => {
          const sector = branchMap.get(branch);
          if (!sector) return null;

          return (
            <div key={`ring-${branch}`} className={className}>
              <TaiyiGodSectorCompact sector={sector} />
            </div>
          );
        })}

        <div className="md:col-start-2 md:col-end-5 md:row-start-2 md:row-end-5 rounded-[1.35rem] border border-border/70 bg-white/75 p-3 md:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Inner Nine Palaces</p>
              <p className="text-sm text-foreground">太乙、文昌、始击等在内盘中的具体落点</p>
            </div>
            <Badge>{chart.taiyi.trend}</Badge>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {innerPalaces.map((palace) => (
              <TaiyiPalaceCompact key={`inner-${palace.index}`} palace={palace} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SanshiSectorCard({ sector }: { sector: SanshiSector }) {
  const tone = getSectorToneStyles(sector.tone);

  return (
    <article
      className={cn(
        "space-y-4 rounded-[1.25rem] border p-5 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]",
        tone.card,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">判断维度</p>
          <h3 className="font-display text-2xl tracking-[0.04em] text-foreground">
            {sector.label}
          </h3>
        </div>
        <Badge className={tone.badge}>{tone.label}</Badge>
      </div>
      <p className="text-sm leading-7 text-foreground/90">{sector.summary}</p>
      <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
        建议动作：{sector.action}
      </div>
    </article>
  );
}

function BulletList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <DashboardSection className="space-y-4" title={title}>
      {items.length ? (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <article
              key={`${title}-${index}`}
              className="rounded-[1.15rem] border border-border/70 bg-white px-4 py-3.5 text-sm leading-7 text-foreground/90 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]"
            >
              {item}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.15rem] border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
          {emptyText}
        </div>
      )}
    </DashboardSection>
  );
}

function formatSanshiCopyText(chart: SanshiChart) {
  return [
    `问题：${chart.meta.question}`,
    `流派：${chart.meta.systemLabel}`,
    `主题：${chart.meta.topicLabel}`,
    `起局时间：${chart.meta.divinationDateTime}`,
    `干支：${chart.meta.ganZhi}`,
    `旬 / 旬空：${chart.meta.xun} / ${chart.meta.xunKong}`,
    `农历：${chart.meta.lunar}`,
    chart.meta.subjectName ? `求测人：${chart.meta.subjectName}` : null,
    chart.meta.notes ? `备注：${chart.meta.notes}` : null,
    "",
    "关键信号：",
    ...chart.signals.map((signal) => `- ${signal.label}：${signal.value}`),
    "",
    "判断维度：",
    ...chart.sectors.map(
      (sector) => `- ${sector.label}（${getSectorToneStyles(sector.tone).label}）：${sector.summary}；建议动作：${sector.action}`,
    ),
    "",
    "行动建议：",
    ...chart.advice.map((item) => `- ${item}`),
    "",
    "风险提醒：",
    ...chart.caution.map((item) => `- ${item}`),
    ...(chart.qimen
      ? [
          "",
          `奇门盘面：${chart.qimen.dunLabel}${chart.qimen.ju}局 / 值符${chart.qimen.chiefDeity} / 值星${chart.qimen.chiefStar} / 值使${chart.qimen.dutyDoor} / 值使落宫${chart.qimen.dutyPalace}`,
        ]
      : chart.taiyi
        ? [
            "",
            `太乙盘面：${chart.taiyi.epoch}第${chart.taiyi.bureau}局 / 太乙${chart.taiyi.taiyiPalace} / 文昌${chart.taiyi.wenchangPalace} / 始击${chart.taiyi.shijiPalace} / 主客定算${chart.taiyi.hostCount}-${chart.taiyi.guestCount}-${chart.taiyi.setCount} / ${chart.taiyi.trend}`,
          ]
      : []),
  ]
    .filter(Boolean)
    .join("\n");
}

function formatQimenCopyText(chart: SanshiChart) {
  if (!chart.qimen) return "";

  return [
    `问题：${chart.meta.question}`,
    `起局时间：${chart.meta.divinationDateTime}`,
    `干支：${chart.meta.ganZhi}`,
    `旬 / 旬空：${chart.meta.xun} / ${chart.meta.xunKong}`,
    `盘面信息：${chart.qimen.dunLabel}${chart.qimen.ju}局 / 值符${chart.qimen.chiefDeity} / 值星${chart.qimen.chiefStar} / 值使${chart.qimen.dutyDoor} / 值使落宫${chart.qimen.dutyPalace}`,
    "九宫盘：",
    ...chart.qimen.palaces.map(
      (palace) =>
        `${palace.palace}(${palace.direction})：地盘${palace.earthStem} / 天盘${palace.heavenStem ?? "中寄"} / ${palace.star ?? "无星"} / ${palace.door ?? "无门"} / ${palace.deity ?? "无神"}`,
    ),
  ].join("\n");
}

function formatTaiyiCopyText(chart: SanshiChart) {
  if (!chart.taiyi) return "";

  return [
    `问题：${chart.meta.question}`,
    `起局时间：${chart.meta.divinationDateTime}`,
    `干支：${chart.meta.ganZhi}`,
    `旬 / 旬空：${chart.meta.xun} / ${chart.meta.xunKong}`,
    `所用计法：${chart.taiyi.countTypeLabel}`,
    `计法依据：${chart.taiyi.countSource}`,
    `盘面信息：${chart.taiyi.epoch}第${chart.taiyi.bureau}局 / 太乙${chart.taiyi.taiyiPalace} / 文昌${chart.taiyi.wenchangPalace} / 计神${chart.taiyi.jishenPalace} / 始击${chart.taiyi.shijiPalace}`,
    `主客定算：${chart.taiyi.hostCount} / ${chart.taiyi.guestCount} / ${chart.taiyi.setCount} / ${chart.taiyi.trend}`,
    "十六宫：",
    ...chart.taiyi.godSectors.map(
      (sector) =>
        `${sector.palace}(${sector.branch})：${sector.god} / ${sector.markers.join("、") || "无标记"} / ${sector.summary}`,
    ),
    "九宫盘：",
    ...chart.taiyi.palaces.map(
      (palace) =>
        `${palace.palace}(${palace.direction})：${palace.trigraph}宫 / ${palace.stage} / ${palace.markers.join("、") || "无标记"} / ${palace.summary}`,
    ),
  ].join("\n");
}

export function SanshiChartView({ chart }: { chart: SanshiChart }) {
  const copyText = useMemo(() => formatSanshiCopyText(chart), [chart]);
  const qimenCopyText = useMemo(() => formatQimenCopyText(chart), [chart]);
  const taiyiCopyText = useMemo(() => formatTaiyiCopyText(chart), [chart]);

  return (
    <div className="space-y-5">
      <DashboardSection
        className="space-y-5"
        title={`${chart.meta.systemLabel}概览`}
        description="三式统一入口下展示的是便于阅读的简化结果。奇门与太乙会额外展示各自盘层，大六壬当前保留趋势、行动与风险摘要。"
        action={<CopyContentButton label="复制解局摘要" text={copyText} />}
      >
        <MetaList
          columns="md:grid-cols-2 xl:grid-cols-3"
          items={[
            {
              label: "流派",
              value: chart.meta.systemLabel,
              detail: chart.meta.topicLabel,
            },
            {
              label: "起局时间",
              value: chart.meta.divinationDateTime,
              detail: chart.meta.lunar,
            },
            {
              label: "问题",
              value: chart.meta.question,
              detail: chart.meta.subjectName ? `求测人：${chart.meta.subjectName}` : undefined,
            },
          ]}
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {chart.signals.map((signal) => (
            <article
              key={`${signal.label}-${signal.value}`}
              className="rounded-[1.15rem] border border-border/70 bg-white px-4 py-3.5 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {signal.label}
              </p>
              <p className="mt-2 text-sm font-medium leading-7 text-foreground">{signal.value}</p>
              {signal.hint ? (
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{signal.hint}</p>
              ) : null}
            </article>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection className="space-y-5" title="四象判断">
        <div className="grid gap-4 md:grid-cols-2">
          {chart.sectors.map((sector) => (
            <SanshiSectorCard key={sector.key} sector={sector} />
          ))}
        </div>
      </DashboardSection>

      {chart.qimen ? (
        <DashboardSection
          className="space-y-5"
          title="奇门盘面"
          action={<CopyContentButton label="复制盘面概要" text={qimenCopyText} />}
        >
          <MetaList
            columns="xl:grid-cols-[1.2fr_1fr]"
            items={[
              {
                label: "盘面信息",
                value: `${chart.qimen.dunLabel}${chart.qimen.ju}局 · 值符${chart.qimen.chiefDeity} · 值使${chart.qimen.dutyDoor}`,
                detail: `${chart.qimen.dayGanZhi} · ${chart.qimen.timeGanZhi} · 时空 ${chart.qimen.hourVoid}`,
              },
              {
                label: "问题",
                value: chart.meta.question,
                detail: `${chart.meta.topicLabel} · ${chart.meta.systemLabel}`,
              },
            ]}
          />

          {chart.qimen.summary.length ? (
            <div className="grid gap-3">
              {chart.qimen.summary.map((item, index) => (
                <article
                  key={`qimen-summary-${index}`}
                  className="rounded-[1.15rem] border border-border/70 bg-muted/10 px-4 py-3.5 text-sm leading-7 text-foreground/90"
                >
                  {item}
                </article>
              ))}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-3">
            {chart.qimen.palaces.map((palace) => (
              <QimenPalaceCell key={palace.index} palace={palace} />
            ))}
          </div>
        </DashboardSection>
      ) : null}

      {chart.taiyi ? (
        <DashboardSection
          className="space-y-5"
          title="太乙盘面"
          description="这里按“十六宫神层 + 九宫盘层”展示产品内的简化太乙盘，重点呈现太乙、文昌、始击与主客定算在两层结构中的落点。"
          action={<CopyContentButton label="复制盘面概要" text={taiyiCopyText} />}
        >
          <MetaList
            columns="md:grid-cols-2 xl:grid-cols-3"
            items={[
              {
                label: "盘面信息",
                value: `${chart.taiyi.epoch}第${chart.taiyi.bureau}局`,
                detail: `太乙${chart.taiyi.taiyiPalace} · 文昌${chart.taiyi.wenchangPalace} · 计神${chart.taiyi.jishenPalace} · 始击${chart.taiyi.shijiPalace}`,
              },
              {
                label: "所用计法",
                value: chart.taiyi.countTypeLabel,
                detail: `${chart.taiyi.countSource} · ${chart.taiyi.countRuleSummary}`,
              },
              {
                label: "主客定算",
                value: `${chart.taiyi.hostCount} / ${chart.taiyi.guestCount} / ${chart.taiyi.setCount}`,
                detail: chart.taiyi.trend,
              },
              {
                label: "问题",
                value: chart.meta.question,
                detail: `${chart.meta.topicLabel} · ${chart.meta.systemLabel}`,
              },
            ]}
          />

          {chart.taiyi.summary.length ? (
            <div className="grid gap-3">
              {chart.taiyi.summary.map((item, index) => (
                <article
                  key={`taiyi-summary-${index}`}
                  className="rounded-[1.15rem] border border-border/70 bg-muted/10 px-4 py-3.5 text-sm leading-7 text-foreground/90"
                >
                  {item}
                </article>
              ))}
            </div>
          ) : null}

          <TaiyiCombinedBoard chart={chart} />

          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold tracking-[0.03em] text-foreground">十六宫神层</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                这一层对应太乙十六宫与十六神，用来看外层神机、主客动势与发力位置。
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {chart.taiyi.godSectors.map((sector) => (
                <TaiyiGodSectorCard key={sector.index} sector={sector} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold tracking-[0.03em] text-foreground">九宫盘层</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                这一层对应内盘九宫，用来看太乙、文昌、始击等落到具体宫位后的内层表现。
              </p>
            </div>
          <div className="grid gap-3 md:grid-cols-3">
            {chart.taiyi.palaces.map((palace) => (
              <TaiyiPalaceCell key={palace.index} palace={palace} />
            ))}
          </div>
          </div>
        </DashboardSection>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <BulletList title="行动建议" items={chart.advice} emptyText="当前没有可展示的行动建议。" />
        <BulletList title="风险提醒" items={chart.caution} emptyText="当前没有可展示的风险提醒。" />
      </div>
    </div>
  );
}
