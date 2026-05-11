import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import type { Database } from "@/types/database";

export default async function ProfilePage() {
  const user = await requireUser();
  const supabase = await getServerSupabaseClient();
  const { data: rawProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  const data = rawProfile as Database["public"]["Tables"]["users"]["Row"] | null;

  return (
    <Card className="space-y-4">
      <CardTitle>账户资料</CardTitle>
      <CardDescription>这里已经预留了订阅状态、Stripe customer 和 credits 字段。</CardDescription>
      <dl className="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">邮箱</dt>
          <dd>{data?.email ?? user.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">订阅状态</dt>
          <dd>{data?.subscription_status ?? "free"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">credits</dt>
          <dd>{data?.credits ?? 0}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">stripe_customer_id</dt>
          <dd>{data?.stripe_customer_id ?? "未绑定"}</dd>
        </div>
      </dl>
    </Card>
  );
}
