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
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "个人资料",
};

export default async function ProfilePage() {
  const user = await requireUser();
  const data = await getUserProfile(user.id);
  const authMode = getAuthMode();
  const isNoneMode = authMode === "none";
  const locale = await getLocale();

  return (
    <DashboardPage>
      <DashboardPageHeader
        eyebrow="Account"
        title={translate(locale, "profile.title")}
        description={translate(locale, "profile.description")}
        action={!isNoneMode ? <SignOutButton variant="outline">{translate(locale, "profile.signOut")}</SignOutButton> : undefined}
      />
      <DashboardSection
        title={translate(locale, isNoneMode ? "profile.guest" : "profile.account")}
        description={translate(locale, isNoneMode ? "profile.guestDescription" : "profile.accountDescription")}
      >
        <dl className="grid gap-5 text-sm md:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-muted-foreground">{translate(locale, "profile.email")}</dt>
            <dd>{isNoneMode ? `guest@zhaoming.local (${translate(locale, "profile.none")})` : (data?.email ?? user.email)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">{translate(locale, "profile.id")}</dt>
            <dd className="font-mono text-xs">{user.id}</dd>
          </div>
        </dl>
      </DashboardSection>
    </DashboardPage>
  );
}
