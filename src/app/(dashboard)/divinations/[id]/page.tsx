import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BaziChartView } from "@/components/divination/bazi-chart";
import { BaziInsights } from "@/components/divination/bazi-insights";
import { ZiweiChartView } from "@/components/divination/ziwei-chart";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
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
        description={
          <span className="text-xs text-muted-foreground">
            命盘生成时间：{formatDateTime(data.created_at)}
          </span>
        }
        action={
          <Button asChild className="rounded-xl px-4">
            <Link href="/divinations/new">再起一张新命盘</Link>
          </Button>
        }
      />

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
    </DashboardPage>
  );
}
