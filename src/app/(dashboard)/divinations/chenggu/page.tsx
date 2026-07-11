import type { Metadata } from "next";
import { ChengguConceptSection, DivinationForm } from "@/components/divination/divination-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "袁天罡称骨",
};

export default async function NewChengguDivinationPage() {
  const locale = await getLocale();
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Divination"
        title={translate(locale, "dashboard.chenggu")}
        description={translate(locale, "home.chengguBody")}
      />
      <DivinationForm
        divinationType="chenggu"
        submitLabel={translate(locale, "form.submit")}
        conceptSection={<ChengguConceptSection />}
      />
    </DashboardPage>
  );
}
