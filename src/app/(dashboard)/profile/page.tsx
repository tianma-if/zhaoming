import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "个人资料",
};

export default async function ProfilePage() {
  const user = await requireUser();
  const data = await getUserProfile(user.id);

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
      <div className="pt-2">
        <SignOutButton variant="outline">退出当前账户</SignOutButton>
      </div>
    </Card>
  );
}
