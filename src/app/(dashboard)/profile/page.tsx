import type { Metadata } from "next";
import {
  DashboardMetricCard,
  DashboardPage,
  DashboardPageHeader,
  DashboardSection,
} from "@/components/layout/dashboard-shell";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "个人资料",
};

export default async function ProfilePage() {
  const user = await requireUser();
  const data = await getUserProfile(user.id);
  const billingCustomerId = data?.billing_customer_id ?? data?.stripe_customer_id ?? null;

  return (
    <DashboardPage>
      <DashboardPageHeader
        eyebrow="Account"
        title="账户资料"
        description="这里已经预留了订阅状态、账单客户标识和 credits 字段，后续继续切换支付提供商时可以复用同一套后台页骨架。"
        action={<SignOutButton variant="outline">退出当前账户</SignOutButton>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard label="Credits" value={data?.credits ?? 0} />
        <DashboardMetricCard label="Subscription" value={data?.subscription_status ?? "free"} />
        <DashboardMetricCard
          label="Billing"
          value={billingCustomerId ? "已绑定" : "未绑定"}
          detail={billingCustomerId ?? "等待正式接入账单系统"}
        />
      </div>
      <DashboardSection title="账户详情" description="当前业务档案字段的实际落库情况。">
        <dl className="grid gap-5 text-sm md:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-muted-foreground">邮箱</dt>
            <dd>{data?.email ?? user.email}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">订阅状态</dt>
            <dd>{data?.subscription_status ?? "free"}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">credits</dt>
            <dd>{data?.credits ?? 0}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">billing_customer_id</dt>
            <dd>{billingCustomerId ?? "未绑定"}</dd>
          </div>
        </dl>
      </DashboardSection>
    </DashboardPage>
  );
}
