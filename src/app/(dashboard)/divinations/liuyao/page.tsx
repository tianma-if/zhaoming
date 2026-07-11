import type { Metadata } from "next";
import { LiuyaoForm } from "@/components/divination/liuyao-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "六爻占卜",
};

export default async function NewLiuyaoDivinationPage() {
  const locale = await getLocale();
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Divination"
        title={translate(locale, "dashboard.liuyao")}
        description={translate(locale, "home.liuyaoBody")}
      />
      <LiuyaoForm />
    </DashboardPage>
  );
}
