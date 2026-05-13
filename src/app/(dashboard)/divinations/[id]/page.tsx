import { notFound } from "next/navigation";
import Link from "next/link";
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
    <div className="space-y-8">
      <Card className="space-y-4 rounded-[2.3rem] border-white/45 bg-white/52 p-7 md:p-9">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.32em] text-muted-foreground">READING VIEW</p>
            <CardTitle className="text-4xl tracking-[0.06em] md:text-5xl">
              {data.divination_type === "bazi" ? "八字解盘" : "紫微斗数解盘"}
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-8 md:text-base">
              {data.question}
            </CardDescription>
          </div>
          <Link
            href="/divinations/new"
            className="rounded-full border border-border/80 px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/68 hover:text-foreground"
          >
            再起一张新命盘
          </Link>
        </div>
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
