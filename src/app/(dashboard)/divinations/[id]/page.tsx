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
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser();
  const locale = await getLocale();
  const data = await getDivinationById(user.id, id);

  if (!data) {
    return {
      title: translate(locale, "dashboard.records"),
    };
  }

  const divinationType = resolveDivinationTypeFromRecord(data);

  return {
    title: translate(locale, divinationType === "bazi" ? "dashboard.bazi" : divinationType === "ziwei" ? "dashboard.ziwei" : divinationType === "liuyao" ? "dashboard.liuyao" : divinationType === "meihua" ? "dashboard.meihua" : divinationType === "sanshi" ? "dashboard.sanshi" : "dashboard.chenggu"),
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
  const locale = await getLocale();
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
        eyebrow={<Badge>{translate(locale, "detail.readingView")}</Badge>}
        title={
          divinationType === "bazi"
            ? translate(locale, "detail.bazi")
            : divinationType === "ziwei"
              ? translate(locale, "detail.ziwei")
              : divinationType === "liuyao"
                ? translate(locale, "detail.liuyao")
                : divinationType === "meihua"
                  ? translate(locale, "detail.meihua")
                  : divinationType === "sanshi"
                    ? `${translate(locale, "detail.sanshi")}-${sanshiChart?.meta.systemLabel ?? translate(locale, "dashboard.sanshi")}`
                    : translate(locale, "detail.chenggu")
        }
        description={
          <span className="text-xs text-muted-foreground">
            {translate(locale, "page.recordTime", { time: formatDateTime(data.created_at) })}
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-3">
            {divinationType === "bazi" ? (
              <Button asChild className="rounded-xl px-4" variant="outline">
                <Link href={`/divinations/compare?divinationId=${data.id}`}>{translate(locale, "detail.modelDemo")}</Link>
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
