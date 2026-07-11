import type { Metadata } from "next";
import { DivinationForm } from "@/components/divination/divination-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Bazi",
};

export default async function NewDivinationPage() {
  const locale = await getLocale();
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Divination"
        title={translate(locale, "dashboard.bazi")}
        description={translate(locale, "home.baziBody")}
      />
      <DivinationForm />
    </DashboardPage>
  );
}
