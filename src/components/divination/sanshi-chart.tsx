"use client";

import { useMemo } from "react";
import { CopyContentButton } from "@/components/divination/copy-content-button";
import { DashboardSection } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  LiurenPalace,
  LiurenTransmission,
  QimenPalace,
  SanshiChart,
  TaiyiGodSector,
  TaiyiPalace,
} from "@/types/divination";

function MetaList({
  items,
  columns = "md:grid-cols-2 xl:grid-cols-4",
  cardClassName,
}: {
  items: Array<{ label: string; value: string; detail?: string }>;
  columns?: string;
  cardClassName?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-5 gap-y-2.5 rounded-[1.1rem] border border-border/70 bg-muted/15 px-4 py-3.5",
        columns,
        cardClassName,
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

function getLiurenCellTone(palace: LiurenPalace) {
  if (palace.markers.some((item) => item === "月将" || item === "初传" || item === "末传")) {
    return "border-black/20 bg-black text-white";
  }

  if (palace.markers.some((item) => item === "中传" || item === "时位")) {
    return "border-emerald-200 bg-emerald-50";
  }

  if (palace.markers.includes("发用侧重")) {
    return "border-amber-200 bg-amber-50";
  }

  return "border-border/70 bg-white";
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

      <div className={cn("mt-3 space-y-1.5 text-[15px]", accent ? "text-white/88" : "text-foreground")}>
        <p>地盘: {palace.earthStem}</p>
        <p>天盘: {palace.heavenStem ?? "中寄"}</p>
        <p>九星: {palace.star ?? "无"}</p>
        <p>八门: {palace.door ?? "中宫无门"}</p>
        <p>八神: {palace.deity ?? "无"}</p>
      </div>
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
      <p className={cn("mt-1 text-xs font-medium", accent ? "text-white" : "text-foreground")}>
        {sector.god}
      </p>
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
      <p className={cn("mt-2 text-xs font-medium", accent ? "text-white" : "text-foreground")}>
        {palace.trigraph}宫
      </p>
      <p className={cn("mt-1 text-xs leading-5", accent ? "text-white/80" : "text-muted-foreground")}>
        {palace.markers.join("、") || "无落点"}
      </p>
    </article>
  );
}

function LiurenPalaceCell({ palace }: { palace: LiurenPalace }) {
  const accent = palace.markers.some((item) => item === "月将" || item === "初传" || item === "末传");
  const markerText = palace.markers.slice(0, 2).join("、");

  return (
    <article
      className={cn(
        "flex min-h-[148px] flex-col rounded-[1.1rem] border px-3 py-3 shadow-[0_14px_30px_-26px_rgba(22,20,17,0.24)] md:h-[240px] md:min-h-0",
        getLiurenCellTone(palace),
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className={cn("text-[10px] uppercase tracking-[0.18em]", accent ? "text-white/70" : "text-muted-foreground")}>
            {palace.direction}
          </p>
          <h4 className="font-display text-[1.9rem] leading-none tracking-[0.08em]">{palace.branch}</h4>
          <p className={cn("text-xs", accent ? "text-white/78" : "text-muted-foreground")}>{palace.palace}</p>
        </div>
        {markerText ? (
          <Badge
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[10px] tracking-[0.12em]",
              accent ? "border-white/20 bg-white/15 text-white" : "",
            )}
          >
            {markerText}
          </Badge>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-3 flex-1 space-y-1.5 border-t pt-2.5 text-xs leading-5",
          accent ? "border-white/10 text-white/88" : "border-border/60 text-foreground",
        )}
      >
        <p>天盘 {palace.heavenBranch}</p>
        <p>天将 {palace.heavenGeneral}</p>
        <p
          className={cn(
            "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]",
            accent ? "text-white/72" : "text-muted-foreground",
          )}
        >
          {palace.summary}
        </p>
      </div>
    </article>
  );
}

function LiurenTransmissionChip({ item }: { item: LiurenTransmission }) {
  return (
    <article className="rounded-[1rem] border border-border/70 bg-white px-3 py-3 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.24)]">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
      <p className="mt-1 font-display text-[1.55rem] leading-none tracking-[0.08em] text-foreground">
        {item.branch}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{item.palace}</p>
      <p className="mt-1 text-xs font-medium text-foreground/80">{item.heavenGeneral}</p>
    </article>
  );
}

function TaiyiCombinedBoard({ chart, copyText }: { chart: SanshiChart; copyText: string }) {
  if (!chart.taiyi) return null;

  const branchMap = new Map(chart.taiyi.godSectors.map((sector) => [sector.branch, sector]));
  const ring = [
    { branch: "乾", style: { left: "8%", top: "8%" } },
    { branch: "亥", style: { left: "29%", top: "8%" } },
    { branch: "子", style: { left: "50%", top: "8%" } },
    { branch: "丑", style: { left: "71%", top: "8%" } },
    { branch: "艮", style: { left: "92%", top: "8%" } },
    { branch: "寅", style: { left: "92%", top: "29%" } },
    { branch: "卯", style: { left: "92%", top: "50%" } },
    { branch: "辰", style: { left: "92%", top: "71%" } },
    { branch: "巽", style: { left: "92%", top: "92%" } },
    { branch: "巳", style: { left: "71%", top: "92%" } },
    { branch: "午", style: { left: "50%", top: "92%" } },
    { branch: "未", style: { left: "29%", top: "92%" } },
    { branch: "坤", style: { left: "8%", top: "92%" } },
    { branch: "申", style: { left: "8%", top: "71%" } },
    { branch: "酉", style: { left: "8%", top: "50%" } },
    { branch: "戌", style: { left: "8%", top: "29%" } },
  ];
  const innerPalaces = chart.taiyi.palaces.slice().sort((a, b) => a.row - b.row || a.col - b.col);

  return (
    <div className="relative space-y-4 rounded-[1.5rem] border border-border/70 bg-white p-4 pb-20 shadow-[0_24px_48px_-36px_rgba(22,20,17,0.28)] md:p-5 md:pb-24">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-[0.03em] text-foreground">组合盘面</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          外围十六宫看神机与主客动势，内部九宫看落宫后的具体着力点。
        </p>
      </div>

      <div className="grid gap-2 md:hidden">
        {ring.map(({ branch }) => {
          const sector = branchMap.get(branch);
          return sector ? <TaiyiGodSectorCompact key={`mobile-ring-${branch}`} sector={sector} /> : null;
        })}

        <div className="rounded-[1.35rem] border border-border/70 bg-white/75 p-3">
          <div className="mb-3 flex items-center justify-end gap-3">
            <Badge>{chart.taiyi.trend}</Badge>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {innerPalaces.map((palace) => (
              <TaiyiPalaceCompact key={`mobile-inner-${palace.index}`} palace={palace} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative hidden min-h-[820px] md:block">
        {ring.map(({ branch, style }) => {
          const sector = branchMap.get(branch);
          return sector ? (
            <div
              key={`ring-${branch}`}
              className="absolute w-[18%] min-w-[136px] -translate-x-1/2 -translate-y-1/2"
              style={style}
            >
              <TaiyiGodSectorCompact sector={sector} />
            </div>
          ) : null;
        })}

        <div className="absolute inset-x-[20%] inset-y-[20%] rounded-[1.35rem] border border-border/70 bg-white/75 p-4">
          <div className="mb-3 flex items-center justify-end gap-3">
            <Badge>{chart.taiyi.trend}</Badge>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {innerPalaces.map((palace) => (
              <TaiyiPalaceCompact key={`inner-${palace.index}`} palace={palace} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 md:bottom-5 md:right-5">
        <CopyContentButton label="复制盘面概要" text={copyText} />
      </div>
    </div>
  );
}

function LiurenCombinedBoard({ chart, copyText }: { chart: SanshiChart; copyText: string }) {
  if (!chart.liuren) return null;

  const palaceMap = new Map(chart.liuren.palaces.map((item) => [item.branch, item]));
  const desktopPlacements = [
    { branch: "亥", className: "col-start-1 row-start-1" },
    { branch: "子", className: "col-start-2 row-start-1" },
    { branch: "丑", className: "col-start-3 row-start-1" },
    { branch: "寅", className: "col-start-4 row-start-1" },
    { branch: "戌", className: "col-start-1 row-start-2" },
    { branch: "卯", className: "col-start-4 row-start-2" },
    { branch: "酉", className: "col-start-1 row-start-3" },
    { branch: "辰", className: "col-start-4 row-start-3" },
    { branch: "申", className: "col-start-1 row-start-4" },
    { branch: "未", className: "col-start-2 row-start-4" },
    { branch: "午", className: "col-start-3 row-start-4" },
    { branch: "巳", className: "col-start-4 row-start-4" },
  ] as const;

  return (
    <div className="relative space-y-4 rounded-[1.5rem] border border-border/70 bg-white p-4 pb-20 shadow-[0_24px_48px_-36px_rgba(22,20,17,0.28)] md:p-5 md:pb-24">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-[0.03em] text-foreground">十二支盘</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          外圈按十二支排盘，中宫收四课与三传。当前仍是产品化简版，不是完整地盘、天盘、天将全叠层，但读盘入口会更接近大六壬。
        </p>
      </div>

      <div className="grid gap-3 md:hidden">
        <div className="grid gap-2 sm:grid-cols-2">
          {chart.liuren.palaces.map((palace) => (
            <LiurenPalaceCell key={`liuren-mobile-${palace.index}`} palace={palace} />
          ))}
        </div>

        <article className="space-y-4 rounded-[1.25rem] border border-border/70 bg-muted/10 p-4">
          <div className="grid gap-2 sm:grid-cols-3">
            {chart.liuren.transmissions.map((item) => (
              <LiurenTransmissionChip key={item.label} item={item} />
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {chart.liuren.lessons.map((lesson) => (
              <div key={lesson.label} className="rounded-xl border border-border/70 bg-white px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{lesson.label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {lesson.upper} / {lesson.lower}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{lesson.relation}</p>
                <p className="mt-2 text-xs leading-5 text-foreground/85">{lesson.hint}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="hidden md:block">
        <div className="rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.99),rgba(249,247,243,0.96))] p-4 shadow-[0_24px_48px_-36px_rgba(22,20,17,0.28)]">
          <div className="mb-3 grid grid-cols-3 text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>西北</span>
            <span>北</span>
            <span>东北</span>
          </div>

          <div className="grid grid-cols-4 grid-rows-[240px_240px_240px_240px] gap-3">
            {desktopPlacements.map(({ branch, className }) => {
              const palace = palaceMap.get(branch);
              return palace ? (
                <div key={`desktop-${branch}`} className={className}>
                  <LiurenPalaceCell palace={palace} />
                </div>
              ) : null;
            })}

            <article className="col-start-2 col-end-4 row-start-2 row-end-4 space-y-3 rounded-[1.9rem] border border-border/70 bg-white/92 p-4">
              <div className="text-center">
                <h4 className="font-display text-[1.6rem] tracking-[0.05em] text-foreground">四课 · 三传</h4>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {chart.liuren.transmissions.map((item) => (
                  <LiurenTransmissionChip key={item.label} item={item} />
                ))}
              </div>
              <div className="grid gap-3 xl:grid-cols-2">
                {chart.liuren.lessons.map((lesson) => (
                  <div
                    key={lesson.label}
                    className="rounded-[1rem] border border-border/70 bg-white/90 px-3 py-3 shadow-[0_10px_24px_-24px_rgba(22,20,17,0.24)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{lesson.label}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {lesson.upper} / {lesson.lower}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{lesson.relation}</p>
                    <p className="mt-2 text-xs leading-5 text-foreground/85">{lesson.hint}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-3 grid grid-cols-3 text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>西南</span>
            <span>南</span>
            <span>东南</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 md:bottom-5 md:right-5">
        <CopyContentButton label="复制盘面概要" text={copyText} />
      </div>
    </div>
  );
}

function formatSanshiCopyText(chart: SanshiChart) {
  const extraBoard = chart.qimen
    ? `奇门盘面：${chart.qimen.dunLabel}${chart.qimen.ju}局 / 值符${chart.qimen.chiefDeity} / 值星${chart.qimen.chiefStar} / 值使${chart.qimen.dutyDoor} / 值使落宫${chart.qimen.dutyPalace}`
    : chart.taiyi
      ? `太乙盘面：${chart.taiyi.epoch}第${chart.taiyi.bureau}局 / 太乙${chart.taiyi.taiyiPalace} / 文昌${chart.taiyi.wenchangPalace} / 始击${chart.taiyi.shijiPalace} / 主客定算${chart.taiyi.hostCount}-${chart.taiyi.guestCount}-${chart.taiyi.setCount} / ${chart.taiyi.trend}`
      : chart.liuren
        ? `大六壬盘面：月将${chart.liuren.monthGeneral}${chart.liuren.monthGeneralPalace} / 时位${chart.liuren.timeLeader}${chart.liuren.timeLeaderPalace} / 发用${chart.liuren.dutyFocus} / 三传${chart.liuren.transmissions.map((item) => `${item.label}${item.branch}`).join("-")}`
        : "";

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
    extraBoard ? "" : null,
    extraBoard || null,
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
    `计法说明：${chart.taiyi.countRuleSummary}`,
    `盘面信息：${chart.taiyi.epoch}第${chart.taiyi.bureau}局 / 太乙${chart.taiyi.taiyiPalace} / 文昌${chart.taiyi.wenchangPalace} / 计神${chart.taiyi.jishenPalace} / 始击${chart.taiyi.shijiPalace}`,
    `主客定算：${chart.taiyi.hostCount} / ${chart.taiyi.guestCount} / ${chart.taiyi.setCount} / ${chart.taiyi.trend}`,
    "十六宫：",
    ...chart.taiyi.godSectors.map(
      (sector) => `${sector.palace}(${sector.branch})：${sector.god} / ${sector.markers.join("、") || "无落点"}`,
    ),
    "九宫盘：",
    ...chart.taiyi.palaces.map(
      (palace) => `${palace.palace}(${palace.direction})：${palace.trigraph}宫 / ${palace.stage} / ${palace.markers.join("、") || "无落点"}`,
    ),
  ].join("\n");
}

function formatLiurenCopyText(chart: SanshiChart) {
  if (!chart.liuren) return "";

  return [
    `问题：${chart.meta.question}`,
    `起局时间：${chart.meta.divinationDateTime}`,
    `干支：${chart.meta.ganZhi}`,
    `旬 / 旬空：${chart.meta.xun} / ${chart.meta.xunKong}`,
    `月将：${chart.liuren.monthGeneral}${chart.liuren.monthGeneralPalace}`,
    `时位：${chart.liuren.timeLeader}${chart.liuren.timeLeaderPalace}`,
    `发用侧重：${chart.liuren.dutyFocus}`,
    `关系焦点：${chart.liuren.relationFocus}`,
    "四课：",
    ...chart.liuren.lessons.map(
      (lesson) => `${lesson.label}：上神${lesson.upper} / 下神${lesson.lower} / ${lesson.relation} / ${lesson.hint}`,
    ),
    "三传：",
    ...chart.liuren.transmissions.map(
      (item) => `${item.label}：${item.branch}${item.palace} / ${item.heavenGeneral} / ${item.summary}`,
    ),
    "十二位：",
    ...chart.liuren.palaces.map(
      (palace) =>
        `${palace.palace}(${palace.branch})：天盘${palace.heavenBranch} / 天将${palace.heavenGeneral} / ${palace.markers.join("、") || "常位"} / ${palace.summary}`,
    ),
  ].join("\n");
}

export function SanshiChartView({ chart }: { chart: SanshiChart }) {
  const copyText = useMemo(() => formatSanshiCopyText(chart), [chart]);
  const qimenCopyText = useMemo(() => formatQimenCopyText(chart), [chart]);
  const taiyiCopyText = useMemo(() => formatTaiyiCopyText(chart), [chart]);
  const liurenCopyText = useMemo(() => formatLiurenCopyText(chart), [chart]);
  const showTaiyiFocusedView = chart.meta.system === "taiyi" && chart.taiyi;

  return (
    <div className="space-y-5">
      {showTaiyiFocusedView ? null : (
        <DashboardSection
          className="space-y-5"
          title={`${chart.meta.systemLabel}概览`}
          description="三式统一入口下展示的是便于阅读的简化结果。奇门、太乙与大六壬都会额外展示各自盘层，用来辅助判断时机、行动与风险边界。"
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
      )}

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
        <DashboardSection className="space-y-5" title={showTaiyiFocusedView ? undefined : "太乙盘面"}>
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

          <TaiyiCombinedBoard chart={chart} copyText={taiyiCopyText} />
        </DashboardSection>
      ) : null}

      {chart.liuren ? (
        <DashboardSection
          className="space-y-5"
          title="大六壬盘面"
          action={<CopyContentButton label="复制盘面概要" text={liurenCopyText} />}
        >
          <MetaList
            columns="md:grid-cols-2 xl:grid-cols-4"
            items={[
              {
                label: "月将",
                value: `${chart.liuren.monthGeneral} · ${chart.liuren.monthGeneralPalace}`,
                detail: "先看局势是被什么外部条件牵动",
              },
              {
                label: "时位",
                value: `${chart.liuren.timeLeader} · ${chart.liuren.timeLeaderPalace}`,
                detail: "对应眼下最先起反应的位置",
              },
              {
                label: "发用侧重",
                value: chart.liuren.dutyFocus,
                detail: `关系焦点：${chart.liuren.relationFocus}`,
              },
              {
                label: "三传主线",
                value: chart.liuren.transmissions.map((item) => `${item.label}${item.branch}`).join(" / "),
                detail: "看事情如何起头、过渡与收束",
              },
            ]}
          />

          <LiurenCombinedBoard chart={chart} copyText={liurenCopyText} />
        </DashboardSection>
      ) : chart.meta.system === "liuren" ? (
        <DashboardSection className="space-y-3" title="大六壬盘面">
          <article className="rounded-[1.15rem] border border-dashed border-border/70 bg-muted/10 px-4 py-3.5 text-sm leading-7 text-muted-foreground">
            这条旧记录还没有保存大六壬盘层数据。重新起局后会展示十二位、四课与三传的简化盘面。
          </article>
        </DashboardSection>
      ) : null}
    </div>
  );
}
