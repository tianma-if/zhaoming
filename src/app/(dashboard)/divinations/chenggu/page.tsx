import type { Metadata } from "next";
import { ChengguConceptSection, DivinationForm } from "@/components/divination/divination-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { listRecentDivinations } from "@/lib/data";
import { toDivinationPrefillRecord } from "@/lib/divination/prefill";

export const metadata: Metadata = {
  title: "袁天罡称骨",
};

export default async function NewChengguDivinationPage() {
  const user = await requireUser();
  const prefillRecords = (await listRecentDivinations(user.id, 8))
    .map(toDivinationPrefillRecord)
    .filter((item) => item !== null);

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
        prefillRecords={prefillRecords}
      />
    </DashboardPage>
  );
}
