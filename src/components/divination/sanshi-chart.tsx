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

const verticalClass = "[writing-mode:vertical-rl] [text-orientation:mixed]";

type MarkerSealLabel =
  | "值符"
  | "值使"
  | "值星"
  | "太乙"
  | "文昌"
  | "计神"
  | "始击"
  | "主算"
  | "客算"
  | "定算";

function MarkerSeal({
  label,
  inverse = false,
  compact = false,
  className,
}: {
  label: MarkerSealLabel;
  inverse?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const config: Record<
    MarkerSealLabel,
    {
      frame: string;
      tone: string;
      glyph: "dot" | "square" | "diamond" | "bar";
    }
  > = {
    值符: { frame: "rounded-[0.42rem]", tone: "text-zinc-900", glyph: "square" },
    值使: { frame: "rounded-[0.42rem]", tone: "text-zinc-800", glyph: "bar" },
    值星: { frame: "rounded-[0.42rem]", tone: "text-zinc-800", glyph: "diamond" },
    太乙: { frame: "rounded-full", tone: "text-[#7f332c]", glyph: "dot" },
    文昌: { frame: "rounded-full", tone: "text-[#7f332c]", glyph: "diamond" },
    计神: { frame: "rounded-[0.42rem]", tone: "text-[#6b614e]", glyph: "bar" },
    始击: { frame: "rounded-[0.42rem]", tone: "text-[#6b614e]", glyph: "square" },
    主算: { frame: "rounded-[0.42rem]", tone: "text-[#6b614e]", glyph: "square" },
    客算: { frame: "rounded-[0.42rem]", tone: "text-zinc-800", glyph: "dot" },
    定算: { frame: "rounded-[0.42rem]", tone: "text-[#6b614e]", glyph: "diamond" },
  };
  const item = config[label];

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1 border px-1.5 font-medium tracking-[0.08em] shadow-none",
        compact ? "h-5 rounded-[0.45rem] py-0 text-[10px]" : "h-5.5 rounded-[0.5rem] py-0 text-[10px]",
        inverse ? "border-white/18 bg-white/10 text-white" : "border-zinc-200/80 bg-white text-zinc-800",
        !inverse && item.tone,
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center border",
          compact ? "h-3 w-3" : "h-3.5 w-3.5",
          item.frame,
          inverse ? "border-current/28 bg-white/8" : "border-current/18 bg-current/[0.08]",
        )}
      >
        <span
          className={cn(
            "block bg-current",
            item.glyph === "dot" && "h-1.5 w-1.5 rounded-full",
            item.glyph === "square" && "h-1.5 w-1.5 rounded-[2px]",
            item.glyph === "diamond" && "h-1.5 w-1.5 rotate-45 rounded-[1px]",
            item.glyph === "bar" && "h-1.5 w-[6px] rounded-full",
          )}
        />
      </span>
      <span>{label}</span>
    </Badge>
  );
}

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

function OverviewGrid({
  items,
}: {
  items: Array<{ label: string; value: string; detail?: string }>;
}) {
  return (
    <div className="grid gap-x-5 gap-y-4 pt-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {items.map((item) => (
          <div key={`${item.label}-${item.value}`} className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
            <p className="mt-1.5 text-sm font-semibold leading-6 tracking-normal text-foreground">{item.value}</p>
            {item.detail ? <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.detail}</p> : null}
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

  return "border-border/70 bg-white";
}

function getTaiyiGodTone(sector: TaiyiGodSector) {
  if (sector.markers.includes("太乙")) {
    return "border-black/20 bg-black text-white";
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
          {palace.isChiefDeity ? <MarkerSeal label="值符" inverse={accent} /> : null}
          {palace.isChiefStar ? <MarkerSeal label="值星" inverse={accent} /> : null}
          {palace.isDutyDoor ? <MarkerSeal label="值使" inverse={accent} /> : null}
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

function QimenPalaceSquare({ palace }: { palace: QimenPalace }) {
  const accent = palace.isDutyDoor || palace.isChiefStar || palace.isChiefDeity;
  const details = [
    { label: "地", value: palace.earthStem },
    { label: "天", value: palace.heavenStem ?? "中寄" },
    { label: "星", value: palace.star ?? "无" },
    { label: "门", value: palace.door ?? "中宫无门" },
    { label: "神", value: palace.deity ?? "无" },
  ];

  return (
    <article
      className={cn(
        "aspect-square overflow-hidden rounded-[1rem] border p-2.5 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]",
        getQimenCellTone(palace),
      )}
    >
      <div className="grid h-full grid-cols-[auto_1fr] gap-2">
        <div className="flex flex-col">
          <p
            className={cn(
              "text-[9px] tracking-[0.16em]",
              accent ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {palace.direction}
          </p>
            <h3
              className={cn(
                verticalClass,
                "mt-1.5 font-display text-[1.6rem] leading-none tracking-[0.03em]",
              )}
            >
              {palace.palace}
          </h3>
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex min-h-5 flex-wrap justify-end gap-1">
            {palace.isChiefDeity ? <MarkerSeal label="值符" inverse={accent} compact /> : null}
            {palace.isChiefStar ? <MarkerSeal label="值星" inverse={accent} compact /> : null}
            {palace.isDutyDoor ? <MarkerSeal label="值使" inverse={accent} compact /> : null}
          </div>

          <div
            className={cn(
              "mt-2 grid flex-1 content-start grid-cols-2 gap-x-1.5 gap-y-1 text-[10.5px] leading-4",
              accent ? "text-white/88" : "text-foreground",
            )}
          >
            {details.map((item) => (
              <div key={`${palace.index}-${item.label}`} className={cn(item.label === "门" ? "col-span-2" : "")}>
                <span className={cn("mr-1 text-[9px]", accent ? "text-white/68" : "text-muted-foreground")}>
                  {item.label}
                </span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function TaiyiGodSectorCompact({
  sector,
  className,
  density = "default",
}: {
  sector: TaiyiGodSector;
  className?: string;
  density?: "default" | "compact";
}) {
  const accent = sector.markers.includes("太乙");

  return (
    <article
      className={cn(
        density === "compact"
          ? "aspect-square rounded-xl border p-2.5 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.24)]"
          : "aspect-square rounded-xl border p-3 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.24)]",
        getTaiyiGodTone(sector),
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("text-[10px] tracking-[0.16em]", accent ? "text-white/70" : "text-muted-foreground")}>
              {sector.branch}
            </p>
            <h4 className={cn(verticalClass, density === "compact" ? "mt-1 text-[13px] font-semibold leading-none" : "mt-1.5 text-sm font-semibold leading-none")}>
              {sector.palace}
            </h4>
          </div>
          {sector.markers.length ? (
            <MarkerSeal
              label={sector.markers[0] as MarkerSealLabel}
              inverse={accent}
              compact={density === "compact"}
            />
          ) : null}
        </div>

        <div className={cn("mt-auto", density === "compact" ? "pt-1.5" : "pt-2")}>
          <p className={cn(density === "compact" ? "text-[11px] font-medium leading-[1.15rem]" : "text-xs font-medium leading-5", accent ? "text-white" : "text-foreground")}>
            {sector.god}
          </p>
        </div>
      </div>
    </article>
  );
}

function TaiyiPalaceCompact({
  palace,
  className,
  density = "default",
}: {
  palace: TaiyiPalace;
  className?: string;
  density?: "default" | "focus";
}) {
  const accent = palace.markers.includes("太乙");

  return (
    <article
      className={cn(
        density === "focus"
          ? "aspect-square rounded-xl border p-4 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.24)]"
          : "aspect-square rounded-xl border p-3 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.24)]",
        getTaiyiCellTone(palace),
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("text-[10px] tracking-[0.16em]", accent ? "text-white/70" : "text-muted-foreground")}>
              {palace.direction}
            </p>
            <h4
              className={cn(
                verticalClass,
                density === "focus" ? "mt-1.5 text-[17px] font-semibold leading-none" : "mt-1.5 text-sm font-semibold leading-none",
              )}
            >
              {palace.palace}
            </h4>
          </div>
          <Badge
            className={cn(
              "shrink-0 rounded-[0.45rem] px-1.5 py-0.5 text-[10px] tracking-[0.08em] shadow-none",
              accent ? "border-white/20 bg-white/15 text-white" : "",
              palace.stage === "旺" && !accent ? "border-zinc-200 bg-zinc-100 text-zinc-700" : "",
              palace.stage === "守" && !accent ? "border-zinc-200 bg-zinc-100 text-zinc-700" : "",
            )}
          >
            {palace.stage}
          </Badge>
        </div>

        <div className={cn("mt-auto space-y-1.5", density === "focus" ? "pt-3" : "pt-2")}>
          <p
            className={cn(
              density === "focus" ? "text-[14px] font-semibold leading-5" : "text-xs font-medium leading-5",
              accent ? "text-white" : "text-foreground",
            )}
          >
            {palace.trigraph}宫
          </p>
          {palace.markers.length ? (
            <div className="flex flex-wrap gap-1">
              {palace.markers.map((marker) => (
                <MarkerSeal
                  key={`${palace.index}-${marker}`}
                  label={marker as MarkerSealLabel}
                  inverse={accent}
                  compact
                />
              ))}
            </div>
          ) : (
            <p
              className={cn(
                density === "focus" ? "text-[13px] leading-6" : "text-xs leading-5",
                accent ? "text-white/80" : "text-muted-foreground",
              )}
            >
              无落点
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function LiurenPalaceCell({ palace }: { palace: LiurenPalace }) {
  const accent = palace.markers.some((item) => item === "月将" || item === "初传" || item === "末传");
  const markerText = palace.markers.slice(0, 2).join("、");

  return (
    <article
      className={cn(
        "flex min-h-[132px] flex-col rounded-[1.1rem] border px-3 py-2.5 shadow-[0_14px_30px_-26px_rgba(22,20,17,0.24)] md:h-[200px] md:min-h-0",
        getLiurenCellTone(palace),
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className={cn("text-[10px] uppercase tracking-[0.18em]", accent ? "text-white/70" : "text-muted-foreground")}>
            {palace.direction}
          </p>
          <h4 className="font-display text-[1.7rem] leading-none tracking-[0.08em]">{palace.branch}</h4>
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
          "mt-2.5 flex-1 space-y-1 border-t pt-2 text-xs leading-5",
          accent ? "border-white/10 text-white/88" : "border-border/60 text-foreground",
        )}
      >
        <p>天盘 {palace.heavenBranch}</p>
        <p>天将 {palace.heavenGeneral}</p>
      </div>
    </article>
  );
}

function LiurenTransmissionChip({ item }: { item: LiurenTransmission }) {
  return (
    <article className="rounded-[1rem] border border-border/70 bg-white px-3 py-2.5 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.24)]">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
      <p className="mt-1 font-display text-[1.4rem] leading-none tracking-[0.08em] text-foreground">
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
  const desktopRing = [
    { branch: "乾", className: "col-start-1 row-start-1" },
    { branch: "亥", className: "col-start-2 row-start-1" },
    { branch: "子", className: "col-start-3 row-start-1" },
    { branch: "丑", className: "col-start-4 row-start-1" },
    { branch: "艮", className: "col-start-5 row-start-1" },
    { branch: "戌", className: "col-start-1 row-start-2" },
    { branch: "寅", className: "col-start-5 row-start-2" },
    { branch: "酉", className: "col-start-1 row-start-3" },
    { branch: "卯", className: "col-start-5 row-start-3" },
    { branch: "申", className: "col-start-1 row-start-4" },
    { branch: "辰", className: "col-start-5 row-start-4" },
    { branch: "坤", className: "col-start-1 row-start-5" },
    { branch: "未", className: "col-start-2 row-start-5" },
    { branch: "午", className: "col-start-3 row-start-5" },
    { branch: "巳", className: "col-start-4 row-start-5" },
    { branch: "巽", className: "col-start-5 row-start-5" },
  ];
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
  const desktopRingStyles = [
    { left: "0%", top: "0%", width: "15.6%", height: "15.6%" },
    { left: "21.1%", top: "0%", width: "15.6%", height: "15.6%" },
    { left: "42.2%", top: "0%", width: "15.6%", height: "15.6%" },
    { left: "63.3%", top: "0%", width: "15.6%", height: "15.6%" },
    { left: "84.4%", top: "0%", width: "15.6%", height: "15.6%" },
    { left: "0%", top: "21.1%", width: "15.6%", height: "15.6%" },
    { left: "84.4%", top: "21.1%", width: "15.6%", height: "15.6%" },
    { left: "0%", top: "42.2%", width: "15.6%", height: "15.6%" },
    { left: "84.4%", top: "42.2%", width: "15.6%", height: "15.6%" },
    { left: "0%", top: "63.3%", width: "15.6%", height: "15.6%" },
    { left: "84.4%", top: "63.3%", width: "15.6%", height: "15.6%" },
    { left: "0%", top: "84.4%", width: "15.6%", height: "15.6%" },
    { left: "21.1%", top: "84.4%", width: "15.6%", height: "15.6%" },
    { left: "42.2%", top: "84.4%", width: "15.6%", height: "15.6%" },
    { left: "63.3%", top: "84.4%", width: "15.6%", height: "15.6%" },
    { left: "84.4%", top: "84.4%", width: "15.6%", height: "15.6%" },
  ];
  const innerPalaces = chart.taiyi.palaces.slice().sort((a, b) => a.row - b.row || a.col - b.col);

  return (
    <div className="relative space-y-4 pb-20 md:pb-24">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-[0.03em] text-foreground">组合盘面</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          外围十六宫看神机与主客动势，内部九宫看落宫后的具体着力点。
        </p>
      </div>

      <div className="grid gap-2 md:hidden">
        <div className="grid grid-cols-2 gap-2">
          {ring.map(({ branch }) => {
            const sector = branchMap.get(branch);
            return sector ? (
              <TaiyiGodSectorCompact
                key={`mobile-ring-${branch}`}
                sector={sector}
                density="compact"
                className="border-border/45 shadow-none"
              />
            ) : null;
          })}
        </div>

        <div className="rounded-[1.35rem] border border-border/75 bg-white p-2 shadow-[0_12px_28px_-26px_rgba(22,20,17,0.1)]">
          <div className="grid grid-cols-3 gap-2">
            {innerPalaces.map((palace) => (
              <TaiyiPalaceCompact key={`mobile-inner-${palace.index}`} palace={palace} density="focus" />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <div className="mx-auto" style={{ width: "min(100%, 58rem)", minWidth: "46rem" }}>
            <div
              className="overflow-hidden rounded-[1.35rem] border border-border/75 bg-white p-3"
              style={{ aspectRatio: "1 / 1" }}
            >
              <div className="relative h-full w-full">
                {desktopRing.map(({ branch }, index) => {
                  const sector = branchMap.get(branch);
                  const style = desktopRingStyles[index];

                  return sector && style ? (
                    <div key={`ring-${branch}`} className="absolute" style={style}>
                      <TaiyiGodSectorCompact
                        sector={sector}
                        density="compact"
                        className="aspect-auto h-full w-full rounded-[0.9rem] border-border/45 shadow-none"
                      />
                    </div>
                  ) : null;
                })}

                <div
                  className="absolute bg-white p-[8px] ring-1 ring-border/55"
                  style={{ left: "18.5%", top: "18.5%", width: "63%", height: "63%" }}
                >
                  <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-px bg-border/55">
                    {innerPalaces.map((palace) => (
                      <TaiyiPalaceCompact
                        key={`inner-${palace.index}`}
                        palace={palace}
                        density="focus"
                        className="aspect-auto h-full w-full rounded-none border-0 shadow-none"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-0 z-10 md:right-5 md:top-1">
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
    <div className="relative space-y-4 pb-20 md:pb-24">
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
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-4 grid-rows-[200px_200px_200px_200px] gap-3">
          {desktopPlacements.map(({ branch, className }) => {
            const palace = palaceMap.get(branch);
            return palace ? (
              <div key={`desktop-${branch}`} className={className}>
                <LiurenPalaceCell palace={palace} />
              </div>
            ) : null;
          })}

          <article className="col-start-2 col-end-4 row-start-2 row-end-4 space-y-2.5 rounded-[1.9rem] border border-border/70 bg-white/92 p-3.5">
            <div className="text-center">
              <h4 className="font-display text-[1.45rem] tracking-[0.05em] text-foreground">四课 · 三传</h4>
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
                  className="rounded-[1rem] border border-border/70 bg-white/90 px-3 py-2.5 shadow-[0_10px_24px_-24px_rgba(22,20,17,0.24)]"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{lesson.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {lesson.upper} / {lesson.lower}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{lesson.relation}</p>
                </div>
              ))}
            </div>
          </article>
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
      (lesson) => `${lesson.label}：上神${lesson.upper} / 下神${lesson.lower} / ${lesson.relation}`,
    ),
    "三传：",
    ...chart.liuren.transmissions.map(
      (item) => `${item.label}：${item.branch}${item.palace} / ${item.heavenGeneral}`,
    ),
    "十二位：",
    ...chart.liuren.palaces.map(
      (palace) =>
        `${palace.palace}(${palace.branch})：天盘${palace.heavenBranch} / 天将${palace.heavenGeneral} / ${palace.markers.join("、") || "常位"}`,
    ),
  ].join("\n");
}

export function SanshiChartView({ chart }: { chart: SanshiChart }) {
  const copyText = useMemo(() => formatSanshiCopyText(chart), [chart]);
  const qimenCopyText = useMemo(() => formatQimenCopyText(chart), [chart]);
  const taiyiCopyText = useMemo(() => formatTaiyiCopyText(chart), [chart]);
  const liurenCopyText = useMemo(() => formatLiurenCopyText(chart), [chart]);
  const showTaiyiFocusedView = chart.meta.system === "taiyi" && chart.taiyi;
  const showOverviewSection = !showTaiyiFocusedView && chart.meta.system !== "liuren";

  return (
    <div className="space-y-5">
      {showOverviewSection ? (
        <DashboardSection
          className="space-y-5"
          action={<CopyContentButton label="复制解局摘要" text={copyText} />}
        >
          <OverviewGrid
            items={[
              {
                label: "流派",
                value: chart.meta.systemLabel,
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
              ...chart.signals.map((signal) => ({
                label: signal.label,
                value: signal.value,
                detail: signal.hint,
              })),
              ...(chart.qimen
                ? [
                    {
                      label: "盘面信息",
                      value: `${chart.qimen.dunLabel}${chart.qimen.ju}局 · 值符${chart.qimen.chiefDeity} · 值使${chart.qimen.dutyDoor}`,
                      detail: `${chart.qimen.dayGanZhi} · ${chart.qimen.timeGanZhi} · 时空 ${chart.qimen.hourVoid}`,
                    },
                  ]
                : []),
            ]}
          />
        </DashboardSection>
      ) : null}

      {chart.qimen ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-[0.02em] text-foreground">
              奇门盘面
            </h2>
            <CopyContentButton label="复制盘面概要" text={qimenCopyText} />
          </div>

          <div className="overflow-x-auto">
            <div className="mx-auto grid w-[600px] min-w-[600px] grid-cols-3 gap-3">
              {chart.qimen.palaces.map((palace) => (
                <QimenPalaceSquare key={palace.index} palace={palace} />
              ))}
            </div>
          </div>
        </section>
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
                detail: chart.meta.systemLabel,
              },
            ]}
          />

          <TaiyiCombinedBoard chart={chart} copyText={taiyiCopyText} />
        </DashboardSection>
      ) : null}

      {chart.liuren ? (
        <DashboardSection className="space-y-5">
          <MetaList
            columns="md:grid-cols-2 xl:grid-cols-4"
            items={[
              {
                label: "月将",
                value: `${chart.liuren.monthGeneral} · ${chart.liuren.monthGeneralPalace}`,
              },
              {
                label: "时位",
                value: `${chart.liuren.timeLeader} · ${chart.liuren.timeLeaderPalace}`,
              },
              {
                label: "发用侧重",
                value: chart.liuren.dutyFocus,
              },
              {
                label: "三传主线",
                value: chart.liuren.transmissions.map((item) => `${item.label}${item.branch}`).join(" / "),
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
