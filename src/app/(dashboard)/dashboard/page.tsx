import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/lib/auth/session";
import { getUserProfile, listRecentDivinations } from "@/lib/data";

export const metadata: Metadata = {
  title: "总览",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const [profile, divinations] = await Promise.all([
    getUserProfile(user.id),
    listRecentDivinations(user.id, 5),
  ]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge>Workspace</Badge>
        <h2 className="font-display text-5xl tracking-[0.06em]">工作台</h2>
        <p className="max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
          从这里开始一张新的命盘，或回到你最近的阅读记录。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="space-y-5 rounded-[2rem] border-white/45 bg-white/56 p-6 shadow-none">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">开始新测算</CardTitle>
              <CardDescription className="text-sm leading-7">
                输入出生信息与问题，进入一张新的命盘阅读页。
              </CardDescription>
            </div>
            <Link href="/divinations/new">
              <Button>进入测算</Button>
            </Link>
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.28em] text-muted-foreground">CREDITS</p>
              <p className="font-display text-4xl">{profile?.credits ?? 0}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-[0.28em] text-muted-foreground">STATUS</p>
              <p className="font-display text-4xl">{profile?.subscription_status ?? "free"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-[0.28em] text-muted-foreground">RECENT</p>
              <p className="font-display text-4xl">{divinations?.length ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 rounded-[2rem] border-white/45 bg-white/56 p-6 shadow-none">
          <CardTitle className="text-2xl">账户摘要</CardTitle>
          <CardDescription className="text-sm leading-7">
            当前账户可继续发起测算，订阅与积分能力已预留。
          </CardDescription>
          <Separator />
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>邮箱：{profile?.email ?? user.email}</p>
            <p>订阅状态：{profile?.subscription_status ?? "free"}</p>
            <p>Stripe Customer：{profile?.stripe_customer_id ?? "未绑定"}</p>
          </div>
        </Card>
      </div>

      <Card className="space-y-5 rounded-[2rem] border-white/45 bg-white/56 p-6 shadow-none">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl">最近记录</CardTitle>
          <Link href="/divinations/new">
            <Button variant="outline">新建测算</Button>
          </Link>
        </div>
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
      </Card>
    </div>
  );
}
