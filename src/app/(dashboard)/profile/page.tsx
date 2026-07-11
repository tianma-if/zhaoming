import type { Metadata } from "next";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardSection,
} from "@/components/layout/dashboard-shell";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/data";
import { getAuthMode } from "@/lib/env";

export const metadata: Metadata = {
  title: "个人资料",
};

export default async function ProfilePage() {
  const user = await requireUser();
  const data = await getUserProfile(user.id);
  const authMode = getAuthMode();
  const isNoneMode = authMode === "none";

  return (
    <DashboardPage>
      <DashboardPageHeader
        eyebrow="Account"
        title="账户资料"
        description={isNoneMode ? "您当前处于免登录游客模式。" : "您的账户基本资料与配置信息。"}
        action={!isNoneMode ? <SignOutButton variant="outline">退出当前账户</SignOutButton> : undefined}
      />
      <DashboardSection
        title={isNoneMode ? "游客模式" : "账户详情"}
        description={isNoneMode ? "免登录模式下，所有操作均作为游客身份进行。" : "当前登录账户的基本业务档案。"}
      >
        <dl className="grid gap-5 text-sm md:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-muted-foreground">邮箱</dt>
            <dd>{isNoneMode ? "guest@zhaoming.local (免登录)" : (data?.email ?? user.email)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">账户 ID</dt>
            <dd className="font-mono text-xs">{user.id}</dd>
          </div>
        </dl>
      </DashboardSection>
    </DashboardPage>
  );
}
