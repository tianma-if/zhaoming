import type { Metadata } from "next";
import { SanshiForm } from "@/components/divination/sanshi-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "三式占卜",
};

export default async function NewSanshiDivinationPage() {
  const locale = await getLocale();
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Sanshi"
        title={translate(locale, "dashboard.sanshi")}
        description={translate(locale, "home.sanshiBody")}
      />
      <SanshiForm />
    </DashboardPage>
  );
}
