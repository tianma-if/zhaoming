import type { Metadata } from "next";
import { DivinationForm, ZiweiConceptSection } from "@/components/divination/divination-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "紫微斗数",
};

export default async function NewZiweiDivinationPage() {
  const locale = await getLocale();
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Divination"
        title={translate(locale, "dashboard.ziwei")}
        description={translate(locale, "home.ziweiBody")}
      />
      <DivinationForm
        divinationType="ziwei"
        submitLabel={translate(locale, "form.submit")}
        conceptSection={<ZiweiConceptSection />}
      />
    </DashboardPage>
  );
}
