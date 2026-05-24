import type { Metadata } from "next";
import { MeihuaForm } from "@/components/divination/meihua-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: "梅花易数",
};

export default async function NewMeihuaDivinationPage() {
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Meihua"
        title="梅花易数"
        description="支持时间起卦与数字起卦，生成本卦、互卦、变卦、动爻和体用关系，并进入后续 AI 解读页面。"
      />
      <MeihuaForm />
    </DashboardPage>
  );
}
