"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatAgeRange,
  formatAgesPreview,
  formatZiweiCenterSummary,
  getZiweiDisplayPalaces,
  type ZiweiDisplayPalace,
  type ZiweiChartMode,
} from "@/lib/divination/renderers/ziwei-view-model";
import type {
  ZiweiChart,
  ZiweiFortunePalace,
  ZiweiPalace,
  ZiweiStarState,
} from "@/types/divination";

const ziweiChartTheme = {
  "--ziwei-page-bg": "#ffffff",
  "--ziwei-surface": "#ffffff",
  "--ziwei-surface-soft": "#ffffff",
  "--ziwei-border": "#e5e7eb",
  "--ziwei-border-strong": "#d1d5db",
  "--ziwei-grid-shadow": "rgba(15, 23, 42, 0.08)",
  "--ziwei-text": "#111827",
  "--ziwei-text-muted": "#6b7280",
  "--ziwei-text-soft": "#9ca3af",
  "--ziwei-center-bg": "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
  "--ziwei-selected-bg": "#f3f0fa",
  "--ziwei-selected-ring": "#76638f",
  "--ziwei-selected-shadow": "rgba(76, 61, 102, 0.18)",
  "--ziwei-tag-body-bg": "#eaf4fb",
  "--ziwei-tag-body-text": "#4b6b83",
  "--ziwei-tag-origin-bg": "#f5efe4",
  "--ziwei-tag-origin-text": "#8a6a2f",
  "--ziwei-tag-slate-bg": "#f3f4f6",
  "--ziwei-tag-slate-text": "#6b7280",
  "--ziwei-mutagen-lu-bg": "#e8f5eb",
  "--ziwei-mutagen-lu-text": "#3f6b4d",
  "--ziwei-mutagen-quan-bg": "#eaf1fb",
  "--ziwei-mutagen-quan-text": "#48627f",
  "--ziwei-mutagen-ke-bg": "#f0ebfa",
  "--ziwei-mutagen-ke-text": "#6d5a8e",
  "--ziwei-mutagen-ji-bg": "#faecec",
  "--ziwei-mutagen-ji-text": "#8a5d5d",
} as CSSProperties;

function formatCompactList(items: string[], limit: number) {
  if (!items.length) return "";

  const visible = items.slice(0, limit);
  const suffix = items.length > limit ? " +" : "";

  return `${visible.join(" · ")}${suffix}`;
}

function MutagenBadge({ value }: { value: string }) {
  const className =
    value === "禄"
      ? "bg-[var(--ziwei-mutagen-lu-bg)] text-[var(--ziwei-mutagen-lu-text)]"
      : value === "权"
        ? "bg-[var(--ziwei-mutagen-quan-bg)] text-[var(--ziwei-mutagen-quan-text)]"
        : value === "科"
          ? "bg-[var(--ziwei-mutagen-ke-bg)] text-[var(--ziwei-mutagen-ke-text)]"
          : "bg-[var(--ziwei-mutagen-ji-bg)] text-[var(--ziwei-mutagen-ji-text)]";

  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-medium",
        className,
      )}
    >
      {value}
    </span>
  );
}

function ScopeChip({
  label,
  tone = "slate",
}: {
  label: string;
  tone?: "amber" | "sky" | "violet" | "slate";
}) {
  const className =
    tone === "amber"
      ? "bg-[var(--ziwei-tag-origin-bg)] text-[var(--ziwei-tag-origin-text)]"
      : tone === "sky"
        ? "bg-[var(--ziwei-tag-body-bg)] text-[var(--ziwei-tag-body-text)]"
        : tone === "violet"
          ? "bg-[var(--ziwei-mutagen-ke-bg)] text-[var(--ziwei-mutagen-ke-text)]"
          : "bg-[var(--ziwei-tag-slate-bg)] text-[var(--ziwei-tag-slate-text)]";

  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", className)}>
      {label}
    </span>
  );
}

function getFortuneCellClass(fortune?: ZiweiFortunePalace) {
  if (!fortune) {
    return "bg-[var(--ziwei-surface)]";
  }

  if (fortune.isDecadalFocus && fortune.isYearlyFocus) {
    return "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--ziwei-tag-origin-bg)_72%,white)_0%,var(--ziwei-surface)_52%,color-mix(in_srgb,var(--ziwei-tag-body-bg)_72%,white)_100%)]";
  }

  if (fortune.isDecadalFocus) {
    return "bg-[color-mix(in_srgb,var(--ziwei-tag-origin-bg)_58%,white)]";
  }

  if (fortune.isYearlyFocus) {
    return "bg-[color-mix(in_srgb,var(--ziwei-tag-body-bg)_60%,white)]";
  }

  if (fortune.isAgeFocus) {
    return "bg-[color-mix(in_srgb,var(--ziwei-mutagen-ke-bg)_62%,white)]";
  }

  return "bg-[var(--ziwei-surface)]";
}

function getFortuneAccentClass(fortune?: ZiweiFortunePalace) {
  if (!fortune) {
    return "";
  }

  if (fortune.isDecadalFocus && fortune.isYearlyFocus) {
    return "ring-1 ring-inset ring-[var(--ziwei-border-strong)]";
  }

  if (fortune.isDecadalFocus) {
    return "ring-1 ring-inset ring-[var(--ziwei-tag-origin-text)]/35";
  }

  if (fortune.isYearlyFocus) {
    return "ring-1 ring-inset ring-[var(--ziwei-tag-body-text)]/35";
  }

  if (fortune.isAgeFocus) {
    return "ring-1 ring-inset ring-[var(--ziwei-mutagen-ke-text)]/35";
  }

  return "";
}

function getSelectedPalaceClass(selected: boolean, mode: ZiweiChartMode, fortune?: ZiweiFortunePalace) {
  if (!selected) {
    return "hover:bg-[var(--ziwei-surface-soft)] hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--ziwei-selected-ring)_24%,white)]";
  }

  if (mode === "fortune") {
    if (fortune?.isDecadalFocus && fortune?.isYearlyFocus) {
      return "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--ziwei-tag-origin-bg)_82%,white)_0%,var(--ziwei-selected-bg)_48%,color-mix(in_srgb,var(--ziwei-tag-body-bg)_82%,white)_100%)] ring-4 ring-inset ring-[var(--ziwei-selected-ring)] shadow-[0_0_0_1px_rgba(255,255,255,0.95),0_12px_28px_-18px_var(--ziwei-selected-shadow)]";
    }

    if (fortune?.isDecadalFocus) {
      return "bg-[color-mix(in_srgb,var(--ziwei-tag-origin-bg)_86%,white)] ring-4 ring-inset ring-[var(--ziwei-tag-origin-text)] shadow-[0_0_0_1px_rgba(255,251,235,0.95),0_12px_28px_-18px_rgba(138,90,31,0.3)]";
    }

    if (fortune?.isYearlyFocus) {
      return "bg-[color-mix(in_srgb,var(--ziwei-tag-body-bg)_88%,white)] ring-4 ring-inset ring-[var(--ziwei-tag-body-text)] shadow-[0_0_0_1px_rgba(240,249,255,0.95),0_12px_28px_-18px_rgba(53,98,122,0.3)]";
    }

    if (fortune?.isAgeFocus) {
      return "bg-[color-mix(in_srgb,var(--ziwei-mutagen-ke-bg)_88%,white)] ring-4 ring-inset ring-[var(--ziwei-mutagen-ke-text)] shadow-[0_0_0_1px_rgba(245,243,255,0.95),0_12px_28px_-18px_rgba(107,79,135,0.28)]";
    }
  }

  return "bg-[var(--ziwei-selected-bg)] ring-4 ring-inset ring-[var(--ziwei-selected-ring)] shadow-[0_0_0_1px_rgba(248,250,252,0.96),0_12px_28px_-18px_var(--ziwei-selected-shadow)]";
}

function getPalaceEdgeClass(row: number, col: number) {
  return cn(
    row === 1 ? "pt-5 md:pt-6" : "",
    row === 4 ? "pb-5 md:pb-6" : "",
    col === 1 ? "pl-5 md:pl-6" : "",
    col === 4 ? "pr-5 md:pr-6" : "",
  );
}

function PalaceCell({
  palace,
  fortune,
  mode,
  edgeClass,
  selected,
  onSelect,
}: {
  palace: ZiweiPalace;
  fortune?: ZiweiFortunePalace;
  mode: ZiweiChartMode;
  edgeClass?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const majorStars: ZiweiStarState[] =
    palace.majorStarStates?.length
      ? palace.majorStarStates
      : palace.majorStars.map((name) => ({ name }));
  const minorStars = palace.minorStarStates?.length
    ? palace.minorStarStates.map((item) => item.name)
    : palace.minorStars;
  const adjectiveStars = palace.adjectiveStarStates?.length
    ? palace.adjectiveStarStates.map((item) => item.name)
    : palace.adjectiveStars;
  const detailLine =
    mode === "natal"
      ? formatCompactList(minorStars, 4)
      : formatCompactList(
          [
            ...(fortune?.decadalStars ?? []),
            ...(fortune?.yearlyStars ?? []),
            ...(fortune?.ageStars ?? []),
          ],
          4,
        );
  const supportLine =
    mode === "natal"
      ? formatCompactList(adjectiveStars, 4)
      : formatCompactList(
          [
            ...(fortune?.decadalMutagens ?? []),
            ...(fortune?.yearlyMutagens ?? []),
            ...(fortune?.ageMutagens ?? []),
          ],
          4,
        );
  const footerLine =
    mode === "natal"
      ? [formatAgeRange(palace), palace.changsheng12].filter(Boolean).join(" · ")
      : [fortune?.decadalPalaceName, fortune?.yearlyPalaceName, fortune?.agePalaceName]
          .filter(Boolean)
          .join(" · ");

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex h-full min-h-44 w-full flex-col px-3 py-3 text-left transition-[background-color,box-shadow,transform] duration-150 md:min-h-48 md:px-3.5 md:py-3.5",
        mode === "fortune" ? getFortuneCellClass(fortune) : "bg-white",
        mode === "fortune" ? getFortuneAccentClass(fortune) : "",
        getSelectedPalaceClass(selected, mode, fortune),
        edgeClass,
        selected ? "-translate-y-0.5" : "",
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-semibold tracking-[0.14em] text-[var(--ziwei-text)]">
                {palace.name}宫
              </h3>
              {palace.isBodyPalace ? <ScopeChip label="身" tone="sky" /> : null}
              {palace.isOriginalPalace ? <ScopeChip label="因" tone="amber" /> : null}
            </div>
            {mode === "fortune" && fortune ? (
              <div className="flex flex-wrap gap-1">
                {fortune.decadalPalaceName ? (
                  <ScopeChip label={`限${fortune.decadalPalaceName}`} tone="amber" />
                ) : null}
                {fortune.yearlyPalaceName ? (
                  <ScopeChip label={`年${fortune.yearlyPalaceName}`} tone="sky" />
                ) : null}
                {fortune.agePalaceName ? (
                  <ScopeChip label={`小${fortune.agePalaceName}`} tone="violet" />
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[11px] tracking-[0.24em] text-[var(--ziwei-text-soft)]">
              {palace.heavenlyStem}
              {palace.earthlyBranch}
            </p>
            <p className="mt-1 text-[11px] text-[var(--ziwei-text-soft)]">{palace.changsheng12}</p>
          </div>
        </div>

        <div>
          <p className="text-base font-semibold leading-6 tracking-[0.03em] text-[var(--ziwei-text)] md:text-[17px]">
            {majorStars.length ? majorStars.map((item) => item.name).join(" · ") : "无主星"}
          </p>
          {majorStars.length ? (
            <p className="mt-1 text-[11px] leading-5 text-[var(--ziwei-text-muted)]">
              {majorStars
                .map((item) => (item.brightness ? `${item.name}${item.brightness}` : item.name))
                .join(" · ")}
            </p>
          ) : null}
        </div>

        {detailLine ? (
          <p className="line-clamp-2 text-[11px] leading-5 text-[var(--ziwei-text-muted)]">{detailLine}</p>
        ) : null}
        {supportLine ? (
          <p className="line-clamp-2 text-[11px] leading-5 text-[color:color-mix(in_srgb,var(--ziwei-text-muted)_88%,white)]">
            {supportLine}
          </p>
        ) : null}
      </div>

      <div className="mt-auto space-y-2 border-t border-[color:color-mix(in_srgb,var(--ziwei-border)_62%,white)] pt-3">
        {mode === "natal" ? (
          <>
            {palace.mutagens?.length ? (
              <div className="flex flex-wrap gap-1">
                {palace.mutagens.map((item) => (
                  <MutagenBadge key={`${palace.index}-${item}`} value={item} />
                ))}
              </div>
            ) : null}
            <div className="space-y-1 text-[10px] leading-4 text-[var(--ziwei-text-soft)]">
              {footerLine ? <p>{footerLine}</p> : null}
              {(palace.boshi12 || palace.jiangqian12 || palace.suiqian12) && (
                <p className="line-clamp-1">
                  {palace.boshi12 ?? "未标注"} · {palace.jiangqian12 ?? "未标注"} ·{" "}
                  {palace.suiqian12 ?? "未标注"}
                </p>
              )}
              {formatAgesPreview(palace) ? (
                <p className="line-clamp-1">小限 {formatAgesPreview(palace)}</p>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-1">
              {fortune?.decadalMutagens.map((item) => (
                <MutagenBadge key={`${palace.index}-decadal-${item}`} value={item} />
              ))}
              {fortune?.yearlyMutagens.map((item) => (
                <MutagenBadge key={`${palace.index}-yearly-${item}`} value={item} />
              ))}
              {fortune?.ageMutagens.map((item) => (
                <MutagenBadge key={`${palace.index}-age-${item}`} value={item} />
              ))}
            </div>
            <div className="space-y-1 text-[10px] leading-4 text-[var(--ziwei-text-soft)]">
              {footerLine ? <p>{footerLine}</p> : null}
              {(fortune?.yearlyJiangqian12 || fortune?.yearlySuiqian12) && (
                <p className="line-clamp-1">
                  年将前 {fortune?.yearlyJiangqian12 ?? "未标注"} · 年岁前{" "}
                  {fortune?.yearlySuiqian12 ?? "未标注"}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </button>
  );
}

function PalaceInteractionPanel({
  cell,
  mode,
}: {
  cell: ZiweiDisplayPalace;
  mode: ZiweiChartMode;
}) {
  const palace = cell.palace;
  const fortune = cell.fortune;
  const mutagedPalaces = palace.mutagedPalaces?.filter((item): item is string => Boolean(item)) ?? [];
  const fortuneScopes = [
    fortune?.decadalPalaceName ? { label: `大限落${fortune.decadalPalaceName}`, tone: "amber" as const } : null,
    fortune?.yearlyPalaceName ? { label: `流年落${fortune.yearlyPalaceName}`, tone: "sky" as const } : null,
    fortune?.agePalaceName ? { label: `小限落${fortune.agePalaceName}`, tone: "violet" as const } : null,
  ].filter(Boolean) as Array<{ label: string; tone: "amber" | "sky" | "violet" }>;

  return (
    <Card className="rounded-[1.4rem] border border-[var(--ziwei-border)] bg-[var(--ziwei-surface)] p-5 shadow-none">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold tracking-[0.06em] text-[var(--ziwei-text)]">{palace.name}宫</h3>
          {palace.isBodyPalace ? <ScopeChip label="身宫" tone="sky" /> : null}
          {palace.isOriginalPalace ? <ScopeChip label="来因宫" tone="amber" /> : null}
        </div>

        {mode === "natal" ? (
          <div className="space-y-3">
            <p className="text-sm text-[var(--ziwei-text-muted)]">
              点击宫位后展示该宫的四化与飞化去向，方便沿着盘面继续读。
            </p>
            {palace.mutagens?.length ? (
              <div className="flex flex-wrap gap-2">
                {palace.mutagens.map((item: string) => (
                  <MutagenBadge key={`${palace.index}-panel-${item}`} value={item} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--ziwei-text-muted)]">当前宫位没有本宫四化。</p>
            )}
            {mutagedPalaces.length ? (
              <div className="flex flex-wrap gap-2">
                {mutagedPalaces.map((item: string, index: number) => (
                  <ScopeChip key={`${palace.index}-mutaged-${item}-${index}`} label={item} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-[var(--ziwei-text-muted)]">
              当前展示该宫在运势盘中的落宫、流耀与流年提示。
            </p>
            {fortuneScopes.length ? (
              <div className="flex flex-wrap gap-2">
                {fortuneScopes.map((item) => (
                  <ScopeChip key={item.label} label={item.label} tone={item.tone} />
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {fortune?.decadalMutagens.map((item: string) => (
                <MutagenBadge key={`${palace.index}-fortune-panel-decadal-${item}`} value={item} />
              ))}
              {fortune?.yearlyMutagens.map((item: string) => (
                <MutagenBadge key={`${palace.index}-fortune-panel-yearly-${item}`} value={item} />
              ))}
              {fortune?.ageMutagens.map((item: string) => (
                <MutagenBadge key={`${palace.index}-fortune-panel-age-${item}`} value={item} />
              ))}
            </div>
            <div className="space-y-2 text-sm text-[var(--ziwei-text-muted)]">
              {fortune?.decadalStars.length ? <p>大限流耀：{fortune.decadalStars.join(" · ")}</p> : null}
              {fortune?.yearlyStars.length ? <p>流年流耀：{fortune.yearlyStars.join(" · ")}</p> : null}
              {fortune?.ageStars.length ? <p>小限流耀：{fortune.ageStars.join(" · ")}</p> : null}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function ZiweiChartView({
  chart,
  subjectName,
}: {
  chart: ZiweiChart;
  subjectName?: string | null;
}) {
  const [mode, setMode] = useState<ZiweiChartMode>("natal");
  const cells = useMemo(() => getZiweiDisplayPalaces(chart), [chart]);
  const [selectedPalaceIndex, setSelectedPalaceIndex] = useState<number | null>(null);
  const center = useMemo(() => formatZiweiCenterSummary(chart, subjectName), [chart, subjectName]);
  const selectedCell =
    cells.find((cell) => cell.index === selectedPalaceIndex) ?? cells[0] ?? null;

  return (
    <div className="space-y-5" style={ziweiChartTheme}>
      <Card className="overflow-hidden rounded-[1.8rem] border border-[color:color-mix(in_srgb,var(--ziwei-border)_58%,white)] bg-[var(--ziwei-surface-soft)] p-3 shadow-[0_18px_50px_-42px_var(--ziwei-grid-shadow)] md:p-4">
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--ziwei-border)] bg-[var(--ziwei-border)] p-px shadow-[0_20px_48px_-40px_var(--ziwei-grid-shadow)]">
            <div className="grid min-w-[920px] grid-cols-4 gap-px bg-[var(--ziwei-border)]">
              {cells.map((cell) => (
                <div
                  key={cell.index}
                  className={cn(
                    "h-full",
                    cell.row === 1 ? "row-start-1" : "",
                    cell.row === 2 ? "row-start-2" : "",
                    cell.row === 3 ? "row-start-3" : "",
                    cell.row === 4 ? "row-start-4" : "",
                    cell.col === 1 ? "col-start-1" : "",
                    cell.col === 2 ? "col-start-2" : "",
                    cell.col === 3 ? "col-start-3" : "",
                    cell.col === 4 ? "col-start-4" : "",
                  )}
                >
                  <PalaceCell
                    palace={cell.palace}
                    fortune={cell.fortune}
                    mode={mode}
                    edgeClass={getPalaceEdgeClass(cell.row, cell.col)}
                    selected={selectedCell?.index === cell.index}
                    onSelect={() => setSelectedPalaceIndex(cell.index)}
                  />
                </div>
              ))}

              <div className="col-start-2 row-start-2 row-span-2 col-span-2">
                <div className="flex h-full min-h-44 flex-col items-center justify-center bg-[var(--ziwei-center-bg)] px-6 py-7 text-center md:min-h-48">
                  <div className="max-w-sm space-y-3">
                    <h3 className="text-2xl font-semibold tracking-[0.08em] text-[var(--ziwei-text)] md:text-[28px]">
                      {center.title || "紫微命盘"}
                    </h3>
                    <div className="mx-auto h-px w-16 bg-[color:color-mix(in_srgb,var(--ziwei-border-strong)_75%,white)]" />
                    <div className="space-y-1 text-xs leading-5 text-[var(--ziwei-text-muted)] md:text-[13px]">
                      {(center.soul || center.body) && (
                        <p>{[center.soul, center.body].filter(Boolean).join(" · ")}</p>
                      )}
                      {center.palaceLine ? <p>{center.palaceLine}</p> : null}
                      {center.timeLine ? <p>{center.timeLine}</p> : null}
                      {center.solarLine ? <p>{center.solarLine}</p> : null}
                      {center.lunarLine ? <p>{center.lunarLine}</p> : null}
                      {mode === "fortune" && center.fortuneLine ? (
                        <p>{center.fortuneLine}</p>
                      ) : null}
                    </div>
                    {mode === "fortune" && chart.fortune ? (
                      <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                        <ScopeChip
                          label={`${chart.fortune.decadal.name} ${chart.fortune.decadal.heavenlyStem}${chart.fortune.decadal.earthlyBranch}`}
                          tone="amber"
                        />
                        <ScopeChip
                          label={`${chart.fortune.yearly.name} ${chart.fortune.yearly.heavenlyStem}${chart.fortune.yearly.earthlyBranch}`}
                          tone="sky"
                        />
                        <ScopeChip
                          label={`${chart.fortune.age.name} ${chart.fortune.age.nominalAge ?? chart.fortune.nominalAge}岁`}
                          tone="violet"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {selectedCell ? <PalaceInteractionPanel cell={selectedCell} mode={mode} /> : null}

      {chart.fortune ? (
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-[var(--ziwei-border)] bg-[var(--ziwei-surface)] p-1 shadow-[0_10px_24px_-18px_var(--ziwei-grid-shadow)]">
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "rounded-full px-6",
                mode === "natal"
                  ? "bg-[var(--ziwei-text)] text-[var(--ziwei-surface)] hover:bg-[var(--ziwei-text)] hover:text-[var(--ziwei-surface)]"
                  : "",
              )}
              onClick={() => setMode("natal")}
            >
              本命盘
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "rounded-full px-6",
                mode === "fortune"
                  ? "bg-[var(--ziwei-text)] text-[var(--ziwei-surface)] hover:bg-[var(--ziwei-text)] hover:text-[var(--ziwei-surface)]"
                  : "",
              )}
              onClick={() => setMode("fortune")}
            >
              运势盘
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
