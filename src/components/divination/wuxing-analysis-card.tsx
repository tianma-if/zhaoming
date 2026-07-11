import { Card, CardTitle } from "@/components/ui/card";
import { WuxingRadarChart, type WuxingRadarDatum } from "./wuxing-radar-chart";
import { useI18n } from "@/components/i18n-provider";

export function WuxingAnalysisCard({
  dayMaster,
  radarData,
}: {
  dayMaster: {
    stem: string;
    element: string;
  };
  radarData: WuxingRadarDatum[];
}) {
  const { t } = useI18n();
  return (
    <Card className="space-y-4 rounded-[1.6rem] border border-border bg-white">
      <div className="space-y-3">
        <CardTitle className="text-2xl tracking-[0.04em]">{t("chart.fiveElements")}</CardTitle>
      </div>

      <WuxingRadarChart
        data={radarData}
        summary={
          <>
            {t("chart.dayMaster")}<span className="font-medium text-foreground">{dayMaster.stem}</span>
            <span className="mx-1.5 text-border">/</span>
            {t("chart.element")}<span className="font-medium text-foreground">{dayMaster.element}</span>
          </>
        }
      />
    </Card>
  );
}
