import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DivinationAiReportButton,
  DivinationAiReportCard,
} from "@/components/divination/divination-ai-report";
import { BaziChartView } from "@/components/divination/bazi-chart";
import { BaziInsights } from "@/components/divination/bazi-insights";
import { ZiweiChartView } from "@/components/divination/ziwei-chart";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth/session";
import { getDivinationById } from "@/lib/data";
import { buildZiweiChart } from "@/lib/divination/adapters/ziwei";
import { divinationInputSchema } from "@/lib/divination/schemas";
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

  const ziweiChart =
    data.divination_type === "ziwei"
      ? (() => {
          const parsed = divinationInputSchema.safeParse(data.input_params);

          if (parsed.success && parsed.data.divinationType === "ziwei") {
            return buildZiweiChart(parsed.data).chart;
          }

          return data.chart_json as unknown as ZiweiChart;
        })()
      : null;

  return (
    <DashboardPage width={data.divination_type === "bazi" ? "default" : "wide"}>
      <DashboardPageHeader
        eyebrow={<Badge>Reading View</Badge>}
        title={data.divination_type === "bazi" ? "八字解盘" : "紫微斗数解盘"}
        description={
          <span className="text-xs text-muted-foreground">
            命盘生成时间：{formatDateTime(data.created_at)}
          </span>
        }
        action={
          <DivinationAiReportButton
            divinationId={data.id}
            initialHasContent={Boolean(data.ai_result_markdown)}
          />
        }
      />

      <div className="space-y-6">
        <DivinationAiReportCard
          divinationId={data.id}
          initialMarkdown={data.ai_result_markdown}
        />
        {data.divination_type === "bazi" ? (
          <>
            <BaziChartView chart={data.chart_json as unknown as BaziChart} />
            <BaziInsights chart={data.chart_json as unknown as BaziChart} />
          </>
        ) : (
          <ZiweiChartView chart={ziweiChart as ZiweiChart} subjectName={data.subject_name} />
        )}
      </div>
    </DashboardPage>
  );
}
