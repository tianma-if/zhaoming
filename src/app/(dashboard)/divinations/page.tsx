import type { Metadata } from "next";
import Link from "next/link";
import {
  DashboardEmptyState,
  DashboardPage,
  DashboardPageHeader,
  DashboardSection,
} from "@/components/layout/dashboard-shell";
import { DivinationRecordsTable } from "@/components/divination/divination-records-table";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { listDivinations } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";

export const metadata: Metadata = {
  title: "测算记录",
};

const divinationTypeLabelMap: Record<string, string> = {
  bazi: "八字",
  ziwei: "紫微斗数",
  chenggu: "称骨",
  liuyao: "六爻",
  sanshi: "三式",
};

export default async function DivinationsPage() {
  const user = await requireUser();
  const data = await listDivinations(user.id);
  const tableData = data.map((item) => {
    const type = resolveDivinationTypeFromRecord(item);

    return {
      id: item.id,
      type,
      typeLabel: divinationTypeLabelMap[type] ?? type,
      question: item.question,
      status: item.status,
      created_at: item.created_at,
    };
  });

  return (
    <DashboardPage width="wide">
      <DashboardPageHeader
        eyebrow="History"
        title="测算记录"
        description="这里汇总你已经生成过的命理与占卜结果，后续扩展筛选、分页和更多状态字段时，可以直接在这张表上继续生长。"
        action={
          <Button asChild className="rounded-xl px-4">
            <Link href="/divinations/new">发起新测算</Link>
          </Button>
        }
      />
      <DashboardSection className="overflow-hidden p-0">
        {tableData.length ? (
          <DivinationRecordsTable data={tableData} />
        ) : (
          <div className="p-6">
            <DashboardEmptyState
              title="还没有测算记录"
              description="先创建一条命盘或占卜记录，后面所有 AI 解读、比较和复看，都会从这里进入。"
              action={
                <Button asChild>
                  <Link href="/divinations/new">立即新建</Link>
                </Button>
              }
            />
          </div>
        )}
      </DashboardSection>
    </DashboardPage>
  );
}
