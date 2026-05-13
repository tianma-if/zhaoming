import { DivinationForm } from "@/components/divination/divination-form";

export default function NewDivinationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs tracking-[0.36em] text-muted-foreground">NEW DIVINATION</p>
        <h2 className="font-display text-5xl tracking-[0.06em] md:text-6xl">开始一次新的阅读</h2>
        <p className="max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
          这里不是一个拥挤的后台表单，而是一张命盘的起点。先把信息交给结构，再让解释慢慢发生。
        </p>
      </div>
      <DivinationForm />
    </div>
  );
}
