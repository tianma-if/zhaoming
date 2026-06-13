import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DivinationAiReportButton,
  DivinationAiReportCard,
} from "@/components/divination/divination-ai-report";
import { DivinationChartRenderer } from "@/components/divination/divination-chart-renderer";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { getDivinationById } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import { formatDateTime } from "@/lib/utils";
import type { SanshiChart } from "@/types/divination";

const divinationTitleMap = {
  bazi: "八字算命",
  ziwei: "紫微斗数",
  chenggu: "袁天罡称骨",
  liuyao: "六爻占卜",
  meihua: "梅花易数",
  sanshi: "三式占卜",
} as const;

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

  const divinationType = resolveDivinationTypeFromRecord(data);

  return {
    title: divinationTitleMap[divinationType as keyof typeof divinationTitleMap] ?? "测算记录",
  };
}

export default async function DivinationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ai?: string }>;
}) {
  const { id } = await params;
  const { ai } = await searchParams;
  const user = await requireUser();
  const data = await getDivinationById(user.id, id);

  if (!data) {
    notFound();
  }

  const divinationType = resolveDivinationTypeFromRecord(data);
  const sanshiChart =
    divinationType === "sanshi" ? (data.chart_json as unknown as SanshiChart) : null;

  return (
    <DashboardPage>
      <DashboardPageHeader
        eyebrow={<Badge>Reading View</Badge>}
        title={
          divinationType === "bazi"
            ? "八字解盘"
            : divinationType === "ziwei"
              ? "紫微斗数解盘"
              : divinationType === "liuyao"
                ? "六爻解卦"
                : divinationType === "meihua"
                  ? "梅花易数解卦"
                  : divinationType === "sanshi"
                    ? `三式解局-${sanshiChart?.meta.systemLabel ?? "三式"}`
                    : "袁天罡称骨结果"
        }
        description={
          <span className="text-xs text-muted-foreground">
            命盘生成时间：{formatDateTime(data.created_at)}
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-3">
            {divinationType === "bazi" ? (
              <Button asChild className="rounded-xl px-4" variant="outline">
                <Link href={`/divinations/compare?divinationId=${data.id}`}>模型对比 Demo</Link>
              </Button>
            ) : null}
            <DivinationAiReportButton
              divinationId={data.id}
              initialHasContent={Boolean(data.ai_result_markdown)}
            />
          </div>
        }
      />

      <div className="space-y-6">
        <DivinationAiReportCard
          divinationId={data.id}
          initialMarkdown={data.ai_result_markdown}
          autoStart={ai === "1"}
        />
        <DivinationChartRenderer record={data} />
      </div>
    </DashboardPage>
  );
}
