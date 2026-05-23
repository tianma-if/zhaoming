import type { Metadata } from "next";
import { ChengguConceptSection, DivinationForm } from "@/components/divination/divination-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: "袁天罡称骨",
};

export default function NewChengguDivinationPage() {
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Divination"
        title="袁天罡称骨"
        description="复用现有出生信息表单，按农历年、月、日、时换算骨重，并生成轻量结果页。"
      />
      <DivinationForm
        divinationType="chenggu"
        submitLabel="开始称骨"
        conceptSection={<ChengguConceptSection />}
      />
    </DashboardPage>
  );
}
