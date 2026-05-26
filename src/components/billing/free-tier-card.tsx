import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FreeTierCard({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col border border-border/70 bg-background/95",
        compact
          ? "rounded-[1.25rem] p-5 shadow-[0_18px_44px_-34px_rgba(22,20,17,0.3)]"
          : "rounded-[2rem] p-6 shadow-[0_26px_80px_-58px_rgba(22,20,17,0.45)]",
      )}
    >
      <Badge
        variant="secondary"
        className={cn("mb-4 w-fit rounded-full px-3 py-1", compact && "mb-3")}
      >
        Free Access
      </Badge>
      <CardTitle className={compact ? "text-lg" : "text-2xl"}>免费版</CardTitle>
      <CardDescription className={cn("mt-3 text-sm", compact ? "leading-6" : "leading-7")}>
        注册后可继续查看排盘结果、基础命盘信息与历史记录，适合先体验产品流程。
      </CardDescription>
      <div className={cn("mt-6 space-y-3 text-sm text-foreground/80", compact ? "leading-6" : "leading-7")}>
        <p>新用户赠送 1 次 AI 报告。</p>
        <p>基础排盘与历史记录继续免费开放。</p>
        <p>完整 AI 解读仅在需要时按次购买。</p>
      </div>
    </Card>
  );
}
