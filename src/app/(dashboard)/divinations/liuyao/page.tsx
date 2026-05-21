import type { Metadata } from "next";
import { LiuyaoForm } from "@/components/divination/liuyao-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "六爻占卜",
};

export default async function NewLiuyaoDivinationPage() {
  await requireUser();

  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Divination"
        title="六爻占卜"
        description="围绕一个明确问题起卦，生成本卦、动爻与变卦结构，并进入后续 AI 解读页面。"
      />
      <LiuyaoForm />
    </DashboardPage>
  );
}
