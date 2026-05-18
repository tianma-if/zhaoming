import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DashboardMetricCard,
  DashboardPage,
  DashboardPageHeader,
  DashboardSection,
} from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { getUserProfile, listRecentDivinations } from "@/lib/data";

export const metadata: Metadata = {
  title: "总览",
};

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const [profile, divinations] = await Promise.all([
    getUserProfile(user.id),
    listRecentDivinations(user.id, 5),
  ]);

  return (
    <DashboardPage>
      <DashboardPageHeader
        eyebrow={<Badge>Workspace</Badge>}
        title="工作台"
        description="从这里开始一张新的命盘，或回到你最近的阅读记录。通用后台框架会收束在这里，后续页面可以直接沿用。"
        action={
          <Button asChild className="rounded-xl px-4">
            <Link href="/divinations/new">进入测算</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <DashboardSection
          className="border-white/45 bg-white/56 shadow-none"
          title="开始新测算"
          description="输入出生信息与问题，进入一张新的命盘阅读页。"
          action={
            <Button asChild>
              <Link href="/divinations/new">进入测算</Link>
            </Button>
          }
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">命盘入口</CardTitle>
              <CardDescription className="text-sm leading-7">
                保持业务页面不变，把壳层和信息组织方式先稳定下来。
              </CardDescription>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardMetricCard
              label="Credits"
              value={profile?.credits ?? 0}
              detail="账户剩余可用额度"
            />
            <DashboardMetricCard
              label="Status"
              value={profile?.subscription_status ?? "free"}
              detail="订阅能力已经预留"
            />
            <DashboardMetricCard
              label="Recent"
              value={divinations?.length ?? 0}
              detail="最近 5 条测算记录"
            />
          </div>
        </DashboardSection>

        <DashboardSection
          className="border-white/45 bg-white/56 shadow-none"
          title="账户摘要"
          description="当前账户可继续发起测算，订阅与积分能力已预留。"
        >
          <Separator />
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>邮箱：{profile?.email ?? user.email}</p>
            <p>订阅状态：{profile?.subscription_status ?? "free"}</p>
            <p>Stripe Customer：{profile?.stripe_customer_id ?? "未绑定"}</p>
          </div>
        </DashboardSection>
      </div>

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
          {divinations?.length ? (
            divinations.map((item) => (
              <Link
                key={item.id}
                href={`/divinations/${item.id}`}
                className="block rounded-[1.25rem] border border-border/70 bg-white/68 p-4 transition hover:bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs tracking-[0.28em] text-muted-foreground">
                      {item.divination_type}
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
