import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getUserProfile, listRecentDivinations } from "@/lib/data";

export default async function DashboardPage() {
  const user = await requireUser();
  const [profile, divinations] = await Promise.all([
    getUserProfile(user.id),
    listRecentDivinations(user.id, 5),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardTitle>{profile?.credits ?? 0}</CardTitle>
          <CardDescription>credits</CardDescription>
        </Card>
        <Card>
          <CardTitle>{profile?.subscription_status ?? "free"}</CardTitle>
          <CardDescription>subscription status</CardDescription>
        </Card>
        <Card>
          <CardTitle>{divinations?.length ?? 0}</CardTitle>
          <CardDescription>recent divinations</CardDescription>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>最近记录</CardTitle>
          <Link href="/divinations/new" className="text-sm text-muted-foreground">
            新建测算
          </Link>
        </div>
        <div className="space-y-3">
          {divinations?.length ? (
            divinations.map((item) => (
              <Link
                key={item.id}
                href={`/divinations/${item.id}`}
                className="block rounded-[1.4rem] bg-white/55 p-4 hover:bg-white/78"
              >
                <p className="text-xs tracking-[0.28em] text-muted-foreground">
                  {item.divination_type}
                </p>
                <p className="mt-2 text-sm leading-7">{item.question}</p>
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
