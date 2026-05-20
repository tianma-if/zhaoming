"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatAgeRange,
  formatAgesPreview,
  formatZiweiCenterSummary,
  getZiweiDisplayPalaces,
  type ZiweiChartMode,
} from "@/lib/divination/renderers/ziwei-view-model";
import type {
  ZiweiChart,
  ZiweiFortunePalace,
  ZiweiPalace,
  ZiweiStarState,
} from "@/types/divination";

function MutagenBadge({ value }: { value: string }) {
  const className =
    value === "禄"
      ? "bg-emerald-500/12 text-emerald-700"
      : value === "权"
        ? "bg-sky-500/12 text-sky-700"
        : value === "科"
          ? "bg-violet-500/12 text-violet-700"
          : "bg-rose-500/12 text-rose-700";

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
      ? "bg-amber-500/12 text-amber-700"
      : tone === "sky"
        ? "bg-sky-500/12 text-sky-700"
        : tone === "violet"
          ? "bg-violet-500/12 text-violet-700"
          : "bg-slate-500/10 text-slate-600";

  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", className)}>
      {label}
    </span>
  );
}

function StarLine({
  title,
  stars,
}: {
  title: string;
  stars: string[];
}) {
  if (!stars.length) return null;

  return (
    <div className="space-y-1">
      <p className="text-[11px] tracking-[0.12em] text-muted-foreground">{title}</p>
      <p className="text-xs leading-5 text-foreground/90">{stars.join(" · ")}</p>
    </div>
  );
}

function getFortuneCellClass(fortune?: ZiweiFortunePalace) {
  if (!fortune) {
    return "border-border bg-white";
  }

  if (fortune.isDecadalFocus && fortune.isYearlyFocus) {
    return "border-sky-300 bg-linear-to-br from-sky-50 via-white to-amber-50";
  }

  if (fortune.isDecadalFocus) {
    return "border-amber-300 bg-linear-to-br from-amber-50 via-white to-white";
  }

  if (fortune.isYearlyFocus) {
    return "border-sky-300 bg-linear-to-br from-sky-50 via-white to-white";
  }

  if (fortune.isAgeFocus) {
    return "border-violet-300 bg-linear-to-br from-violet-50 via-white to-white";
  }

  return "border-border bg-white";
}

function PalaceCell({
  palace,
  fortune,
  mode,
}: {
  palace: ZiweiPalace;
  fortune?: ZiweiFortunePalace;
  mode: ZiweiChartMode;
}) {
  const majorStars: ZiweiStarState[] =
    palace.majorStarStates?.length
      ? palace.majorStarStates
      : palace.majorStars.map((name) => ({ name }));
  const minorStars = palace.minorStars.slice(0, 6);
  const adjectiveStars = palace.adjectiveStars.slice(0, 6);

  return (
    <article
      className={cn(
        "flex min-h-52 flex-col rounded-2xl border p-4 transition-colors",
        mode === "fortune" ? getFortuneCellClass(fortune) : "border-border bg-white",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-semibold tracking-[0.04em]">{palace.name}宫</h3>
            {palace.isBodyPalace ? <ScopeChip label="身宫" tone="sky" /> : null}
            {palace.isOriginalPalace ? <ScopeChip label="来因" tone="amber" /> : null}
          </div>
          {mode === "fortune" && fortune ? (
            <div className="flex flex-wrap gap-1.5">
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
        <div className="text-right">
          <p className="text-xs tracking-[0.18em] text-muted-foreground">
            {palace.heavenlyStem}
            {palace.earthlyBranch}
          </p>
          <p className="mt-2 text-sm font-medium text-foreground/70">{palace.changsheng12}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-lg font-semibold leading-7">
            {majorStars.length ? majorStars.map((item) => item.name).join(" · ") : "无主星"}
          </p>
          {majorStars.length ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {majorStars
                .map((item) => (item.brightness ? `${item.name}${item.brightness}` : item.name))
                .join(" · ")}
            </p>
          ) : null}
        </div>

        {minorStars.length ? (
          <p className="text-xs leading-5 text-muted-foreground">{minorStars.join(" · ")}</p>
        ) : null}
        {adjectiveStars.length ? (
          <p className="text-xs leading-5 text-muted-foreground/80">{adjectiveStars.join(" · ")}</p>
        ) : null}

        {mode === "natal" ? (
          <div className="space-y-2 pt-1 text-xs text-muted-foreground">
            <p>
              博士十二神：{palace.boshi12 ?? "未标注"} · 将前：{palace.jiangqian12 ?? "未标注"} · 岁前：
              {palace.suiqian12 ?? "未标注"}
            </p>
            <p>
              大限：{formatAgeRange(palace) || "未标注"}
              {palace.decadal
                ? `（${palace.decadal.heavenlyStem}${palace.decadal.earthlyBranch}）`
                : ""}
            </p>
            <p>小限：{formatAgesPreview(palace) || "未标注"}</p>
            {palace.mutagens?.length ? (
              <div className="flex flex-wrap gap-1">
                {palace.mutagens.map((item) => (
                  <MutagenBadge key={`${palace.index}-${item}`} value={item} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap gap-1.5">
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

            <StarLine title="大限流耀" stars={fortune?.decadalStars ?? []} />
            <StarLine title="流年流耀" stars={fortune?.yearlyStars ?? []} />
            <StarLine title="小限流耀" stars={fortune?.ageStars ?? []} />

            {(fortune?.yearlyJiangqian12 || fortune?.yearlySuiqian12) && (
              <p className="text-xs leading-5 text-muted-foreground">
                年将前：{fortune?.yearlyJiangqian12 ?? "未标注"} · 年岁前：
                {fortune?.yearlySuiqian12 ?? "未标注"}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
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
  const center = useMemo(() => formatZiweiCenterSummary(chart, subjectName), [chart, subjectName]);

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden rounded-[1.8rem] border border-border bg-white p-4 shadow-none md:p-5">
        <div className="overflow-x-auto">
          <div className="grid min-w-[920px] grid-cols-4 gap-3">
          {cells.map((cell) => (
            <div
              key={cell.index}
              className={cn(
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
              <PalaceCell palace={cell.palace} fortune={cell.fortune} mode={mode} />
            </div>
          ))}

          <div className="col-start-2 row-start-2 row-span-2 col-span-2">
            <div className="flex h-full min-h-52 flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-border bg-linear-to-br from-muted/10 via-white to-muted/20 px-6 py-8 text-center">
              <div className="space-y-3">
                <h3 className="text-3xl font-semibold tracking-[0.06em]">
                  {center.title || "紫微命盘"}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {center.soul ? <p>{center.soul}</p> : null}
                  {center.body ? <p>{center.body}</p> : null}
                  {center.palaceLine ? <p>{center.palaceLine}</p> : null}
                  {center.timeLine ? <p>{center.timeLine}</p> : null}
                  {center.solarLine ? <p>{center.solarLine}</p> : null}
                  {center.lunarLine ? <p>{center.lunarLine}</p> : null}
                  {mode === "fortune" && center.fortuneLine ? <p>{center.fortuneLine}</p> : null}
                </div>
                {mode === "fortune" && chart.fortune ? (
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
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
      </Card>

      {chart.fortune ? (
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "rounded-full px-6",
                mode === "natal" ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "",
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
                  ? "bg-foreground text-background hover:bg-foreground hover:text-background"
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
