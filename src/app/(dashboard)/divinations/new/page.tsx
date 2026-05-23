import type { Metadata } from "next";
import { DivinationForm } from "@/components/divination/divination-form";
import { DashboardPage, DashboardPageHeader } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: "八字算命",
};

export default function NewDivinationPage() {
  return (
    <DashboardPage width="narrow" className="space-y-10 pt-2">
      <DashboardPageHeader
        eyebrow="Divination"
        title="八字计算"
        description="精准解析生辰八字，揭示命盘奥秘。业务内容继续保留，但页面容器改成与后台其他模块一致的骨架。"
      />
      <DivinationForm />
    </DashboardPage>
  );
}
