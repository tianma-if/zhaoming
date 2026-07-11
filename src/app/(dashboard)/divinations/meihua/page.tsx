import type { Metadata } from "next";
import { MeihuaForm } from "@/components/divination/meihua-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "梅花易数",
};

export default async function NewMeihuaDivinationPage() {
  const locale = await getLocale();
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Meihua"
        title={translate(locale, "dashboard.meihua")}
        description={translate(locale, "home.meihuaBody")}
      />
      <MeihuaForm />
    </DashboardPage>
  );
}
