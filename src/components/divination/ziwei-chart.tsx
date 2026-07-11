"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CopyContentButton } from "./copy-content-button";
import {
  formatAgeRange,
  formatAgesPreview,
  formatZiweiCenterSummary,
  getZiweiDisplayPalaces,
  type ZiweiChartMode,
  type ZiweiDisplayPalace,
} from "@/lib/divination/renderers/ziwei-view-model";
import type {
  ZiweiChart,
  ZiweiFortunePalace,
  ZiweiPalace,
  ZiweiStarState,
} from "@/types/divination";
import { useI18n } from "@/components/i18n-provider";

const ziweiChartTheme = {
  "--ziwei-surface": "#ffffff",
  "--ziwei-surface-soft": "#fbfbfc",
  "--ziwei-border": "#d9dce3",
  "--ziwei-border-strong": "#bfc5cf",
  "--ziwei-grid-shadow": "rgba(15, 23, 42, 0.06)",
  "--ziwei-text": "#111827",
  "--ziwei-text-muted": "#6b7280",
  "--ziwei-text-soft": "#9ca3af",
  "--ziwei-center-bg": "#f7f8fb",
  "--ziwei-selected-bg": "#f4f1fb",
  "--ziwei-selected-ring": "#171717",
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

const verticalClass = "[writing-mode:vertical-rl] [text-orientation:mixed]";

function formatCompactList(items: string[], limit: number) {
  if (!items.length) return "";
  return items.slice(0, limit).join(" · ");
}

function formatZiweiCopyText({
  chart,
  cells,
}: {
  chart: ZiweiChart;
  cells: ZiweiDisplayPalace[];
}) {
  const highlights = cells
    .map((cell) => {
      const main = cell.palace.majorStars.length ? cell.palace.majorStars.join("、") : "无主星";
      return `${cell.palace.name}：${main}`;
    })
    .join("\n");

  return [
    `阳历：${chart.meta.solar}`,
    `农历：${chart.meta.lunar}`,
    chart.meta.chineseDate ? `中文日期：${chart.meta.chineseDate}` : "",
    chart.meta.zodiac ? `生肖：${chart.meta.zodiac}` : "",
    chart.meta.time ? `出生时辰：${chart.meta.time}` : "",
    `宫位摘要：\n${highlights}`,
  ]
    .filter(Boolean)
    .join("\n");
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
    <span className={cn("rounded px-1 py-0.5 text-[10px] font-medium leading-none", className)}>
      {label}
    </span>
  );
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
    <span className={cn("rounded px-1 py-0.5 text-[10px] font-medium leading-none", className)}>
      {value}
    </span>
  );
}

function buildMainColumns(
  palace: ZiweiPalace,
  mode: ZiweiChartMode,
  fortune?: ZiweiFortunePalace,
) {
  if (mode === "fortune") {
    const stars = [
      ...(fortune?.decadalStars ?? []),
      ...(fortune?.yearlyStars ?? []),
      ...(fortune?.ageStars ?? []),
    ];

    return Array.from(new Set(stars)).slice(0, 8).map((name) => ({ name }));
  }

  const states: ZiweiStarState[] =
    palace.majorStarStates?.length
      ? palace.majorStarStates
      : palace.majorStars.map((name) => ({ name }));

  return states.slice(0, 8).map((item) => ({
    name: item.name,
    sub: item.brightness,
  }));
}

function renderVerticalColumns(columns: Array<{ name: string; sub?: string }>, emptyLabel: string) {
  if (!columns.length) {
    return <div className="text-[10px] text-[var(--ziwei-text-soft)]">{emptyLabel}</div>;
  }

  return (
    <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
      {columns.map((item, index) => (
        <div key={`${item.name}-${index}`} className="flex items-start gap-0.5">
          <span className={cn(verticalClass, "text-[11px] font-semibold leading-none text-[var(--ziwei-text)]")}>
            {item.name}
          </span>
          {item.sub ? (
            <span className={cn(verticalClass, "text-[9px] leading-none text-[var(--ziwei-text-soft)]")}>
              {item.sub}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function getPalaceBackground(mode: ZiweiChartMode, selected: boolean, fortune?: ZiweiFortunePalace) {
  if (selected) return "bg-[var(--ziwei-selected-bg)]";
  if (mode !== "fortune" || !fortune) return "bg-[var(--ziwei-surface)]";
  if (fortune.isDecadalFocus && fortune.isYearlyFocus) return "bg-[#f7f1ea]";
  if (fortune.isDecadalFocus) return "bg-[#fbf5ea]";
  if (fortune.isYearlyFocus) return "bg-[#eef7fb]";
  if (fortune.isAgeFocus) return "bg-[#f5f1fb]";
  return "bg-[var(--ziwei-surface)]";
}

function PalaceCell({
  palace,
  fortune,
  mode,
  selected,
  onSelect,
}: {
  palace: ZiweiPalace;
  fortune?: ZiweiFortunePalace;
  mode: ZiweiChartMode;
  selected: boolean;
  onSelect: () => void;
}) {
  const { t } = useI18n();
  const mainColumns = buildMainColumns(palace, mode, fortune);
  const minorLine =
    mode === "fortune"
      ? formatCompactList(
          [
            ...(fortune?.decadalMutagens ?? []),
            ...(fortune?.yearlyMutagens ?? []),
            ...(fortune?.ageMutagens ?? []),
          ],
          6,
        )
      : formatCompactList(palace.minorStars, 6);
  const adjectiveLine =
    mode === "fortune"
      ? [fortune?.decadalPalaceName, fortune?.yearlyPalaceName, fortune?.agePalaceName]
          .filter(Boolean)
          .join(" / ")
      : formatCompactList(palace.adjectiveStars, 5);
  const footerLeft =
    mode === "fortune"
      ? [fortune?.yearlyJiangqian12, fortune?.yearlySuiqian12].filter(Boolean).join(" · ")
      : [palace.boshi12, palace.jiangqian12, palace.suiqian12].filter(Boolean).join(" · ");
  const footerRight =
    mode === "fortune"
      ? [formatAgeRange(palace), formatAgesPreview(palace)].filter(Boolean).join(" / ")
      : [formatAgeRange(palace), formatAgesPreview(palace)].filter(Boolean).join(" / ");

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden border border-transparent p-3 text-left transition-colors duration-150",
        "hover:bg-[var(--ziwei-surface-soft)]",
        getPalaceBackground(mode, selected, fortune),
        selected ? "border-[var(--ziwei-selected-ring)] shadow-[inset_0_0_0_1px_var(--ziwei-selected-ring)]" : "",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <h3 className="text-[11px] font-semibold leading-none text-[var(--ziwei-text)] md:text-[12px]">
            {palace.name}{t("ziwei.palace")}
          </h3>
          {palace.isBodyPalace ? <ScopeChip label={t("ziwei.body")} tone="sky" /> : null}
          {palace.isOriginalPalace ? <ScopeChip label={t("ziwei.origin")} tone="amber" /> : null}
        </div>
        <div className="flex items-start gap-1">
          <span className={cn(verticalClass, "text-[10px] font-semibold leading-none text-[var(--ziwei-text)]")}>
            {palace.changsheng12}
          </span>
          <span className={cn(verticalClass, "text-[10px] leading-none text-[var(--ziwei-text-soft)]")}>
            {palace.heavenlyStem}
            {palace.earthlyBranch}
          </span>
        </div>
      </div>

      <div className="grid flex-1 grid-rows-[1fr_auto] gap-3">
        <div className="min-h-0">{renderVerticalColumns(mainColumns, t("ziwei.noMainStar"))}</div>

        <div className="space-y-2 text-[10px] leading-4 text-[var(--ziwei-text-muted)]">
          {minorLine ? <p>{minorLine}</p> : null}
          {adjectiveLine ? <p>{adjectiveLine}</p> : null}
          {palace.mutagens?.length ? (
            <div className="flex flex-wrap gap-1">
              {palace.mutagens.map((item) => (
                <MutagenBadge key={`${palace.index}-${item}`} value={item} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 border-t border-[var(--ziwei-border)] pt-2 text-[10px] leading-4 text-[var(--ziwei-text-soft)]">
        <div className="space-y-0.5">
          {footerLeft ? <p>{footerLeft}</p> : null}
          {minorLine ? <p>{mode === "fortune" ? t("ziwei.flowLimit") : t("ziwei.assistantStars")}</p> : null}
        </div>
        <div className="text-right">
          {footerRight ? <p>{footerRight}</p> : null}
        </div>
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
  const { t } = useI18n();
  const { palace, fortune } = cell;

  return (
    <Card className="rounded-[0.9rem] border border-[var(--ziwei-border)] bg-white px-4 py-3 shadow-none">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="text-[15px] font-semibold text-[var(--ziwei-text)]">{palace.name}{t("ziwei.palace")}</h3>
          {palace.isBodyPalace ? <ScopeChip label={t("ziwei.body")} tone="sky" /> : null}
          {palace.isOriginalPalace ? <ScopeChip label={t("ziwei.origin")} tone="amber" /> : null}
        </div>

        <div className="grid gap-x-5 gap-y-1.5 md:grid-cols-2">
          <div className="flex gap-2 text-[12px] leading-5">
            <span className="shrink-0 font-medium text-[var(--ziwei-text-soft)]">{t("ziwei.mainStars")}</span>
            <p className="text-[var(--ziwei-text)]">
              {palace.majorStars.length ? palace.majorStars.join(" · ") : t("ziwei.noMainStar")}
            </p>
          </div>
          <div className="flex gap-2 text-[12px] leading-5">
            <span className="shrink-0 font-medium text-[var(--ziwei-text-soft)]">{t("ziwei.assistantStars")}</span>
            <p className="text-[var(--ziwei-text-muted)]">
              {[...palace.minorStars, ...palace.adjectiveStars].join(" · ") || t("ziwei.none")}
            </p>
          </div>
        </div>

        <div className="grid gap-x-5 gap-y-1 text-[12px] leading-5 text-[var(--ziwei-text-muted)] md:grid-cols-2">
          <p>干支：{palace.heavenlyStem}{palace.earthlyBranch}　长生：{palace.changsheng12 || "暂无"}</p>
          <p>大限：{formatAgeRange(palace) || "暂无"}　小限：{formatAgesPreview(palace) || "暂无"}</p>
          <p>博士：{palace.boshi12 || "暂无"}　将前：{palace.jiangqian12 || "暂无"}</p>
          <p>岁前：{palace.suiqian12 || "暂无"}</p>
        </div>

        <div
          className={cn(
            "grid min-h-[2.625rem] gap-x-5 gap-y-1 border-t border-[var(--ziwei-border)] pt-2 text-[12px] leading-5 md:grid-cols-3",
            mode === "fortune" && fortune ? "text-[var(--ziwei-text-muted)]" : "invisible",
          )}
          aria-hidden={mode !== "fortune" || !fortune}
        >
          <p>大限落宫：{fortune?.decadalPalaceName || "暂无"}</p>
          <p>流年落宫：{fortune?.yearlyPalaceName || "暂无"}</p>
          <p>小限落宫：{fortune?.agePalaceName || "暂无"}</p>
        </div>
      </div>
    </Card>
  );
}

function CenterBoard({
  chart,
  subjectName,
  mode,
}: {
  chart: ZiweiChart;
  subjectName?: string | null;
  mode: ZiweiChartMode;
}) {
  const { t } = useI18n();
  const center = formatZiweiCenterSummary(chart, subjectName);

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[var(--ziwei-center-bg)] p-6 text-center">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="#d9dce3" strokeDasharray="3 3" strokeWidth="0.4" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#d9dce3" strokeDasharray="3 3" strokeWidth="0.4" />
        <line x1="50" y1="0" x2="0" y2="50" stroke="#d9dce3" strokeDasharray="3 3" strokeWidth="0.4" />
        <line x1="50" y1="0" x2="100" y2="50" stroke="#d9dce3" strokeDasharray="3 3" strokeWidth="0.4" />
        <line x1="0" y1="50" x2="50" y2="100" stroke="#d9dce3" strokeDasharray="3 3" strokeWidth="0.4" />
        <line x1="100" y1="50" x2="50" y2="100" stroke="#d9dce3" strokeDasharray="3 3" strokeWidth="0.4" />
      </svg>

      <div className="relative z-10 max-w-sm space-y-3">
        <h3 className="text-3xl font-semibold tracking-[0.08em] text-[var(--ziwei-text)]">
          {center.title || t("ziwei.centerTitle")}
        </h3>
        <div className="space-y-1 text-sm leading-7 text-[var(--ziwei-text-muted)]">
          {(center.soul || center.body) && <p>{[center.soul, center.body].filter(Boolean).join(" · ")}</p>}
          {center.palaceLine ? <p>{center.palaceLine}</p> : null}
          {center.timeLine ? <p>{center.timeLine}</p> : null}
          {center.solarLine ? <p>{center.solarLine}</p> : null}
          {center.lunarLine ? <p>{center.lunarLine}</p> : null}
          {mode === "fortune" && center.fortuneLine ? <p>{center.fortuneLine}</p> : null}
        </div>
      </div>
    </div>
  );
}

export function ZiweiChartView({
  chart,
  subjectName,
}: {
  chart: ZiweiChart;
  subjectName?: string | null;
}) {
  const { t } = useI18n();
  const [mode, setMode] = useState<ZiweiChartMode>("natal");
  const cells = useMemo(() => getZiweiDisplayPalaces(chart), [chart]);
  const [selectedPalaceIndex, setSelectedPalaceIndex] = useState<number | null>(null);
  const copyText = useMemo(() => formatZiweiCopyText({ chart, cells }), [cells, chart]);
  const selectedCell = cells.find((cell) => cell.index === selectedPalaceIndex) ?? cells[0] ?? null;

  return (
    <div className="space-y-5" style={ziweiChartTheme}>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <div className="mx-auto" style={{ width: "min(100%, 68rem)", minWidth: "52rem" }}>
            <div
              className="overflow-hidden rounded-[1.35rem] border border-[var(--ziwei-border)] bg-[var(--ziwei-border)]"
              style={{ aspectRatio: "1 / 1" }}
            >
              <div
                className="grid h-full w-full gap-px"
                style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gridTemplateRows: "repeat(4, minmax(0, 1fr))" }}
              >
              {cells.map((cell) => (
                <div
                  key={cell.index}
                  className={cn(
                    "relative min-h-0 min-w-0 bg-white",
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
                    selected={selectedCell?.index === cell.index}
                    onSelect={() => setSelectedPalaceIndex(cell.index)}
                  />
                </div>
              ))}

              <div className="col-start-2 row-start-2 col-span-2 row-span-2 bg-white">
                <CenterBoard chart={chart} subjectName={subjectName} mode={mode} />
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <CopyContentButton
            className="border-[var(--ziwei-border)] bg-[var(--ziwei-surface)] text-[var(--ziwei-text-muted)] hover:bg-[var(--ziwei-surface-soft)] hover:text-[var(--ziwei-text)]"
            label={t("chart.copy")}
            text={copyText}
          />
        </div>
      </div>

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
                  ? "bg-[var(--ziwei-text)] text-white hover:bg-[var(--ziwei-text)] hover:text-white"
                  : "",
              )}
              onClick={() => setMode("natal")}
            >
              {t("chart.natal")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "rounded-full px-6",
                mode === "fortune"
                  ? "bg-[var(--ziwei-text)] text-white hover:bg-[var(--ziwei-text)] hover:text-white"
                  : "",
              )}
              onClick={() => setMode("fortune")}
            >
              {t("chart.fortune")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
