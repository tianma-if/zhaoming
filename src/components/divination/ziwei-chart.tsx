import type { ZiweiChart } from "@/types/divination";
import { getZiweiGrid } from "@/lib/divination/renderers/ziwei-view-model";
import { ChartShell } from "./chart-shell";

export function ZiweiChartView({ chart }: { chart: ZiweiChart }) {
  const cells = getZiweiGrid(chart);

  return (
    <ChartShell
      title="紫微斗数"
      description="4 × 4 中空环形网格，强调宫位与星曜的文字张力。"
    >
      <div className="grid grid-cols-4 gap-3">
        {cells.map((palace, index) =>
          palace ? (
            <article
              key={`${palace.name}-${index}`}
              className="min-h-36 rounded-[1rem] border border-border bg-white p-3"
            >
              <div className="mb-2 flex items-center justify-between text-xs tracking-[0.18em] text-muted-foreground">
                <span>{palace.name}</span>
                <span>
                  {palace.heavenlyStem}
                  {palace.earthlyBranch}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm">{palace.majorStars.join(" · ") || "无主星"}</p>
                <p className="text-xs text-muted-foreground">
                  {[...palace.minorStars, ...palace.adjectiveStars]
                    .slice(0, 4)
                    .join(" · ")}
                </p>
              </div>
            </article>
          ) : (
            <div
              key={`empty-${index}`}
              className="min-h-36 rounded-[1rem] border border-dashed border-border bg-muted/50"
            />
          ),
        )}
      </div>
    </ChartShell>
  );
}
