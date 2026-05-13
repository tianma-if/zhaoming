import { DivinationForm } from "@/components/divination/divination-form";

export default function NewDivinationPage() {
  return (
    <div className="space-y-10 pt-2">
      <div className="space-y-3 text-center">
        <p className="text-xs tracking-[0.36em] text-muted-foreground">八字计算</p>
        <h2 className="font-display text-5xl tracking-[0.06em] md:text-6xl">输入信息，开始测算</h2>
        <p className="mx-auto max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
          精准解析生辰八字，先得到结构化命盘，再进入 AI 解读页面。
        </p>
      </div>
      <DivinationForm />
    </div>
  );
}
