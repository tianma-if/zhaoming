import { notFound } from "next/navigation";
import { AiReadingPanel } from "@/components/divination/ai-reading-panel";
import { BaziChartView } from "@/components/divination/bazi-chart";
import { ZiweiChartView } from "@/components/divination/ziwei-chart";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getDivinationById } from "@/lib/data";
import type { BaziChart, ZiweiChart } from "@/types/divination";

export default async function DivinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const data = await getDivinationById(user.id, id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <CardTitle>{data.divination_type === "bazi" ? "八字解盘" : "紫微斗数解盘"}</CardTitle>
        <CardDescription>{data.question}</CardDescription>
      </Card>
      {data.divination_type === "bazi" ? (
        <BaziChartView chart={data.chart_json as unknown as BaziChart} />
      ) : (
        <ZiweiChartView chart={data.chart_json as unknown as ZiweiChart} />
      )}
      <AiReadingPanel divinationId={data.id} question={data.question} />
    </div>
  );
}
