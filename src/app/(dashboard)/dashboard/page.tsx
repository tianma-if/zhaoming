import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import type { Database } from "@/types/database";

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await getServerSupabaseClient();

  const [{ data: rawProfile }, { data: rawDivinations }] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("divinations")
      .select("id, divination_type, question, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  const profile = rawProfile as Database["public"]["Tables"]["users"]["Row"] | null;
  const divinations = (rawDivinations ?? []) as Array<{
    id: string;
    divination_type: string;
    question: string;
    created_at: string;
  }>;

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
