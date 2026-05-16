import { DivinationForm } from "@/components/divination/divination-form";

export default function NewDivinationPage() {
  return (
    <div className="space-y-14 pt-8">
      <div className="space-y-5 text-center">
        <p className="text-sm font-medium tracking-[0.28em] text-muted-foreground">八字计算</p>
        <h2 className="text-5xl font-semibold tracking-[0.04em] md:text-6xl">输入信息，开始测算</h2>
        <p className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
          输入出生信息，先生成结构化命盘，再进入 AI 解读页面。
        </p>
      </div>
      <DivinationForm />
    </div>
  );
}
