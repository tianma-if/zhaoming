import type { Metadata } from "next";
import { SanshiForm } from "@/components/divination/sanshi-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "三式占卜",
};

export default async function NewSanshiDivinationPage() {
  await requireUser();

  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Sanshi"
        title="三式占卜"
        description="统一入口支持奇门遁甲、太乙神数与大六壬的简化起局，先帮助你判断时机、策略和风险边界，再进入 AI 深入解读。"
      />
      <SanshiForm />
    </DashboardPage>
  );
}
