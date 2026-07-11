import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/components/i18n-provider";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;

export function BaziDaYunAnalysis({ daYun }: { daYun: NonNullable<BaziViewModel["daYun"]> }) {
  const { t } = useI18n();
  return (
    <Card className="space-y-3 rounded-[1.6rem] border border-border bg-white">
      <div>
        <CardTitle className="text-[1.7rem] tracking-[0.04em]">{t("chart.dayun")}</CardTitle>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="grid gap-3 text-sm min-[760px]:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">{t("chart.startLuck")}</p>
            <p className="text-lg font-semibold leading-tight">{daYun.startLabel}</p>
            <p className="text-xs text-muted-foreground">{daYun.startSolar}</p>
          </div>

          {daYun.current ? (
            <div className="space-y-1 min-[760px]:text-right">
              <p className="text-[11px] text-muted-foreground">{t("chart.currentLuck")}</p>
              <p className="text-lg font-semibold leading-tight">{t("chart.ageRange")}{daYun.current.ageRange}</p>
              <p className="text-xs text-muted-foreground">
                {daYun.current.tenGod} / {daYun.current.ganZhi}
              </p>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {daYun.periods.map((period) => {
            const isChildStage = period.index === 0;

            return (
              <article
                key={`${period.index}-${period.ganZhi || "child"}`}
                className="space-y-2 rounded-xl border border-border bg-white px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">
                      {isChildStage ? t("chart.childStage") : `${period.index}${t("chart.cycle")} · ${period.startYear}`}
                    </p>
                    <p className="mt-1 text-base font-semibold leading-tight">
                      {t("chart.ageRange")}{period.ageRange}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {isChildStage ? t("chart.smallLuck") : period.tenGod}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-lg font-semibold leading-none">
                    {period.ganZhi || "父母庇护期"}
                  </p>
                </div>

                <div className="grid grid-cols-[3.25rem_1fr] gap-x-2.5 gap-y-0.5 text-[11px] leading-5">
                  <p className="text-muted-foreground">{t("chart.tenGodShort")}</p>
                  <p>{period.tenGod || "-"}</p>

                  <p className="text-muted-foreground">{t("chart.heavenlyStem")}</p>
                  <p>
                    <span className="mr-2 font-semibold">
                      {period.ganZhi ? period.ganZhi.slice(0, 1) : "-"}
                    </span>
                    {period.stemElement || "-"}
                  </p>

                  <p className="text-muted-foreground">{t("chart.earthlyBranch")}</p>
                  <p>
                    <span className="mr-2 font-semibold">
                      {period.ganZhi ? period.ganZhi.slice(1, 2) : "-"}
                    </span>
                    {period.branchElement || "-"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
