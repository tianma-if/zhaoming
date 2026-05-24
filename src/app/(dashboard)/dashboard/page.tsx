import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardSection,
} from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { listRecentDivinations } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";

export const metadata: Metadata = {
  title: "总览",
};

const divinationTypeLabelMap: Record<string, string> = {
  bazi: "八字",
  ziwei: "紫微斗数",
  chenggu: "称骨",
  liuyao: "六爻",
  meihua: "梅花",
  sanshi: "三式",
};

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const divinations = await listRecentDivinations(user.id, 5);

  return (
    <DashboardPage>
      <DashboardPageHeader title="工作台" />

      <DashboardSection
        className="border-white/45 bg-white/56 shadow-none"
        title="最近记录"
        action={
          <Button asChild variant="outline">
            <Link href="/divinations/new">新建测算</Link>
          </Button>
        }
      >
        <Separator />
        <div className="space-y-3">
          {divinations.length ? (
            divinations.map((item) => (
              <Link
                key={item.id}
                href={`/divinations/${item.id}`}
                className="block rounded-[1.25rem] border border-border/70 bg-white/68 p-4 transition hover:bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs tracking-[0.28em] text-muted-foreground">
                      {divinationTypeLabelMap[resolveDivinationTypeFromRecord(item)] ??
                        resolveDivinationTypeFromRecord(item)}
                    </p>
                    <p className="text-sm leading-7">{item.question}</p>
                  </div>
                  <Badge>{item.status}</Badge>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">还没有测算记录。</p>
          )}
        </div>
      </DashboardSection>
    </DashboardPage>
  );
}
