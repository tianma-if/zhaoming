import type { Metadata } from "next";
import { DivinationForm } from "@/components/divination/divination-form";

export const metadata: Metadata = {
  title: "八字算命",
};

export default function NewDivinationPage() {
  return (
    <div className="space-y-14 pt-8">
      <div className="space-y-6 py-6 text-center">
        <h2 className="text-5xl font-semibold tracking-[0.02em] text-foreground md:text-6xl">
          八字计算
        </h2>
        <p className="mx-auto max-w-3xl text-xl font-medium leading-9 text-muted-foreground md:text-2xl">
          精准解析生辰八字，揭示命盘奥秘
        </p>
      </div>
      <DivinationForm />
    </div>
  );
}
