import type { Metadata } from "next";
import Link from "next/link";
import { BaziModelCompareDemo } from "@/components/divination/bazi-model-compare-demo";
import {
  DashboardEmptyState,
  DashboardPage,
  DashboardPageHeader,
} from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { BAZI_DEMO_MODEL_OPTIONS } from "@/lib/ai/model-comparison";
import { requireUser } from "@/lib/auth/session";
import { listDivinations } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "八字模型对比",
};

export default async function DivinationComparePage({
  searchParams,
}: {
  searchParams: Promise<{ divinationId?: string }>;
}) {
  const { divinationId } = await searchParams;
  const user = await requireUser();
  const records = await listDivinations(user.id);
  const baziRecords = records
    .filter((item) => resolveDivinationTypeFromRecord(item) === "bazi")
    .map((item) => ({
      id: item.id,
      subjectName: item.subject_name,
      question: item.question,
      createdAt: formatDateTime(item.created_at),
    }));

  return (
    <DashboardPage width="full">
      <DashboardPageHeader
        eyebrow="Lab"
        title="八字模型对比"
        description="用同一条八字记录、同一套预置 prompt，同时比较 DeepSeek 与 Gemini 的实际输出差异。"
        action={
          <Button asChild className="rounded-xl px-4" variant="outline">
            <Link href="/divinations">返回记录列表</Link>
          </Button>
        }
      />

      {baziRecords.length ? (
        <BaziModelCompareDemo
          initialDivinationId={divinationId}
          models={BAZI_DEMO_MODEL_OPTIONS}
          records={baziRecords}
        />
      ) : (
        <DashboardEmptyState
          title="还没有八字记录"
          description="先创建一条八字命盘，再回到这里做多模型并排测试。"
          action={
            <Button asChild>
              <Link href="/divinations/new">去创建八字命盘</Link>
            </Button>
          }
        />
      )}
    </DashboardPage>
  );
}
