import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardTitle } from "@/components/ui/card";
import { CopyContentButton } from "./copy-content-button";
import { useI18n } from "@/components/i18n-provider";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;
type BaziPillarView = BaziViewModel["pillars"][number];

function formatPillarsCopy(pillars: BaziPillarView[]) {
  return [
    "八字详解",
    ...pillars.map((pillar) =>
      [
        `${pillar.label}：${pillar.ganZhi}`,
        `天干五行：${pillar.elements[0] ?? "-"}`,
        `地支五行：${pillar.elements[1] ?? "-"}`,
        `十神：${pillar.shiShenGan || "-"}`,
        `纳音：${pillar.naYin || "-"}`,
      ].join("\n"),
    ),
  ].join("\n\n");
}

export function BaziPillarsInfoCard({
  baziText,
  pillars,
}: {
  baziText: string;
  pillars: BaziPillarView[];
}) {
  const { t } = useI18n();
  const copyText = formatPillarsCopy(pillars);

  return (
    <Card className="space-y-3 rounded-[1.6rem] border border-border bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle className="text-[1.7rem] tracking-[0.04em]">{t("chart.pillars")}</CardTitle>
        </div>
        <CopyContentButton
          className="h-8 rounded-md px-2.5 text-xs"
          label={t("chart.copy")}
          text={`${baziText}\n\n${copyText}`}
        />
      </div>

      <div className="grid gap-4 text-center [grid-template-columns:repeat(auto-fit,minmax(min(100%,7rem),1fr))]">
        {pillars.map((pillar) => (
          <article key={pillar.key} className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{pillar.label}</p>
            <p className="font-display text-[2rem] leading-none">{pillar.ganZhi}</p>
            <dl className="space-y-0.5 text-xs leading-5">
              <div className="flex justify-center gap-1.5">
                <dt className="text-muted-foreground">{t("chart.heavenElement")}</dt>
                <dd className="font-medium">{pillar.elements[0]}</dd>
              </div>
              <div className="flex justify-center gap-1.5">
                <dt className="text-muted-foreground">{t("chart.earthElement")}</dt>
                <dd className="font-medium">{pillar.elements[1]}</dd>
              </div>
              <div className="flex justify-center gap-1.5">
                <dt className="text-muted-foreground">{t("chart.tenGod")}</dt>
                <dd className="font-medium">{pillar.shiShenGan || "-"}</dd>
              </div>
              <div className="flex justify-center gap-1.5">
                <dt className="text-muted-foreground">{t("chart.nayin")}</dt>
                <dd className="font-medium">{pillar.naYin || "-"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </Card>
  );
}
