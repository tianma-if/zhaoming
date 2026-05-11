import { DivinationForm } from "@/components/divination/divination-form";

export default function NewDivinationPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs tracking-[0.36em] text-muted-foreground">NEW DIVINATION</p>
        <h2 className="font-display text-5xl tracking-[0.06em]">结构化排盘</h2>
      </div>
      <DivinationForm />
    </div>
  );
}
