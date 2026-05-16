import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AiReadingPanel } from "@/components/divination/ai-reading-panel";
import { BaziChartView } from "@/components/divination/bazi-chart";
import { BaziInsights } from "@/components/divination/bazi-insights";
import { ZiweiChartView } from "@/components/divination/ziwei-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/lib/auth/session";
import { getDivinationById } from "@/lib/data";
import type { BaziChart, ZiweiChart } from "@/types/divination";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser();
  const data = await getDivinationById(user.id, id);

  if (!data) {
    return {
      title: "测算记录",
    };
  }

  return {
    title: data.divination_type === "bazi" ? "八字算命" : "紫微斗数",
  };
}

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
      <Card className="space-y-5 rounded-[1.75rem] border border-border bg-white p-6 shadow-none md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge>READING VIEW</Badge>
            <CardTitle className="text-4xl tracking-[0.04em] md:text-5xl">
              {data.divination_type === "bazi" ? "八字解盘" : "紫微斗数解盘"}
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-8 md:text-base">
              {data.question}
            </CardDescription>
          </div>
          <Link
            href="/divinations/new"
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            再起一张新命盘
          </Link>
        </div>
        <Separator />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">SYSTEM</p>
            <p className="text-sm">{data.divination_type === "bazi" ? "八字" : "紫微斗数"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">STATUS</p>
            <p className="text-sm">{data.status}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">QUESTION</p>
            <p className="text-sm line-clamp-2">{data.question}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_24rem]">
        <div className="space-y-6">
          {data.divination_type === "bazi" ? (
            <>
              <BaziChartView chart={data.chart_json as unknown as BaziChart} />
              <BaziInsights chart={data.chart_json as unknown as BaziChart} />
            </>
          ) : (
            <ZiweiChartView chart={data.chart_json as unknown as ZiweiChart} />
          )}
        </div>

        <div className="space-y-6">
          <AiReadingPanel divinationId={data.id} question={data.question} />
        </div>
      </div>
    </div>
  );
}
