import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import {
  DashboardPage,
  DashboardPageHeader,
} from "@/components/layout/dashboard-shell";
import { DivinationRecordsPanel } from "@/components/divination/divination-records-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "测算记录",
};

export default async function DivinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string; credits?: string }>;
}) {
  const { purchase, credits } = await searchParams;
  const creditedAmount = Number(credits ?? 0);
  const showSuccessBanner =
    purchase === "success" && Number.isFinite(creditedAmount) && creditedAmount > 0;

  return (
    <DashboardPage width="wide">
      <DashboardPageHeader
        eyebrow="History"
        title="测算记录"
        action={
          <Button asChild className="rounded-xl px-4">
            <Link href="/divinations/new">发起新测算</Link>
          </Button>
        }
      />
      {showSuccessBanner ? (
        <Card className="flex items-start gap-4 rounded-[1.5rem] border-emerald-200 bg-emerald-50/80 p-5 text-emerald-950 shadow-none">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">支付成功，{creditedAmount} 次 AI 报告已到账。</p>
            <p className="text-sm text-emerald-800/80">
              你可以直接继续发起新的测算，或在记录列表里回看之前的结果。
            </p>
          </div>
        </Card>
      ) : null}
      <DivinationRecordsPanel />
    </DashboardPage>
  );
}
