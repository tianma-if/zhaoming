import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AiReadingPanel } from "@/components/divination/ai-reading-panel";
import { BaziChartView } from "@/components/divination/bazi-chart";
import { BaziInsights } from "@/components/divination/bazi-insights";
import { ZiweiChartView } from "@/components/divination/ziwei-chart";
import {
  DashboardMetricCard,
  DashboardPage,
  DashboardPageHeader,
  DashboardSection,
} from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { getDivinationById } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";
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
    <DashboardPage width="wide">
      <DashboardPageHeader
        eyebrow={<Badge>Reading View</Badge>}
        title={data.divination_type === "bazi" ? "八字解盘" : "紫微斗数解盘"}
        description={data.question}
        action={
          <Button asChild className="rounded-xl px-4">
            <Link href="/divinations/new">再起一张新命盘</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <DashboardMetricCard
          label="System"
          value={data.divination_type === "bazi" ? "八字" : "紫微斗数"}
          detail="当前命盘体系"
        />
        <DashboardMetricCard label="Status" value={data.status} detail="当前记录状态" />
        <DashboardMetricCard
          label="Created"
          value={formatDateTime(data.created_at)}
          detail="命盘生成时间"
          className="md:col-span-2"
        />
      </div>

      <DashboardSection
        title="问题摘要"
        description="这部分用于快速确认本次提问语境，不打断后面的命盘阅读区。"
      >
        <p className="text-sm leading-8 text-muted-foreground">{data.question}</p>
      </DashboardSection>

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
    </DashboardPage>
  );
}
