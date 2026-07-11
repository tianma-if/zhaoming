import type { ChengguChart } from "@/types/divination";
import { Card, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/i18n-provider";

const chineseNumberMap = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"] as const;

function formatWeightText(value: string) {
  return value.replace(/\d/g, (digit) => chineseNumberMap[Number(digit)] ?? digit);
}

export function ChengguChartView({ chart }: { chart: ChengguChart }) {
  const { t } = useI18n();
  const toneLabel = chart.totalQian <= 39 ? "轻骨" : chart.totalQian <= 54 ? "中骨" : "重骨";

  return (
    <Card className="space-y-8 rounded-[1.8rem] border border-border bg-white p-6 shadow-none">
      <section className="space-y-4">
        <div className="space-y-4">
          <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">{t("chart.chengguOverview")}</p>

          <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">{t("chart.totalWeight")}</p>
              <p className="text-[2.85rem] leading-none tracking-[0.02em] text-foreground">
                {formatWeightText(chart.totalText)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">{t("chart.fateRange")}</p>
              <p className="text-[2rem] leading-none tracking-[0.02em] text-foreground">
                {toneLabel}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 text-sm leading-7 text-muted-foreground">
            <p>农历：{chart.meta.lunar} · {chart.meta.lunarYearGanZhi}年 · {chart.meta.timeZhi}时</p>
          </div>
        </div>
      </section>

      <div className="h-px bg-border/70" />

      <section className="space-y-6">
        <div className="space-y-2">
        <CardTitle className="text-3xl tracking-[0.04em]">{t("chart.fourWeights")}</CardTitle>
        </div>

        <div className="overflow-hidden rounded-[1.35rem] border border-border bg-muted/15">
          <div className="hidden grid-cols-[1fr_1fr_1.2fr_4rem] border-b border-border/80 bg-muted/30 px-5 py-3 text-xs tracking-[0.2em] text-muted-foreground uppercase md:grid">
            <span>{t("chart.item")}</span>
            <span>{t("chart.value")}</span>
            <span>{t("chart.source")}</span>
            <span className="text-right">{t("chart.description")}</span>
          </div>
          <div>
            {chart.weights.map((item, index) => (
              <div
                key={item.key}
                className="grid gap-3 px-5 py-4 text-sm text-foreground/88 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border/70 md:grid-cols-[1fr_1fr_1.2fr_4rem] md:items-center md:gap-4"
              >
                <div className="min-w-0 space-y-1 md:space-y-0">
                  <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase md:hidden">
                    {t("chart.item")}
                  </p>
                  <p className="font-medium">{item.label}</p>
                </div>
                <div className="min-w-0 space-y-1 md:space-y-0">
                  <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase md:hidden">
                    {t("chart.value")}
                  </p>
                  <p className="text-[1.75rem] leading-none tracking-[0.02em] text-foreground">
                    {formatWeightText(item.display)}
                  </p>
                </div>
                <div className="min-w-0 space-y-1 md:space-y-0">
                  <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase md:hidden">
                    {t("chart.source")}
                  </p>
                  <p className="text-muted-foreground md:truncate">{item.source}</p>
                </div>
                <div className="min-w-0 space-y-1 text-left text-muted-foreground md:text-right">
                  <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase md:hidden">
                    {t("chart.description")}
                  </p>
                  {index === 0
                    ? "年"
                    : index === 1
                      ? "月"
                      : index === 2
                        ? "日"
                        : "时"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-border/70" />

      <section className="space-y-5">
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[0.04em]">{t("chart.traditionalVerdict")}</CardTitle>
        </div>
        <p className="font-wenkai text-[1.1rem] leading-9 text-foreground">{chart.verdict}</p>
      </section>
    </Card>
  );
}
