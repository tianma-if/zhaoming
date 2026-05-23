import type { Metadata } from "next";
import { DivinationForm, ZiweiConceptSection } from "@/components/divination/divination-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: "紫微斗数",
};

export default function NewZiweiDivinationPage() {
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Divination"
        title="紫微排盘"
        description="输入出生信息，生成紫微斗数命盘，并进入后续解读页面。"
      />
      <DivinationForm
        divinationType="ziwei"
        submitLabel="排盘"
        conceptSection={<ZiweiConceptSection />}
      />
    </DashboardPage>
  );
}
