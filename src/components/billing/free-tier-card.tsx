import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

export function FreeTierCard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { t } = useI18n();
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
      <CardTitle className={compact ? "text-lg" : "text-2xl"}>{t("billing.free")}</CardTitle>
      <CardDescription className={cn("mt-3 text-sm", compact ? "leading-6" : "leading-7")}>
        {t("billing.freeDescription")}
      </CardDescription>
      <div className={cn("mt-6 space-y-3 text-sm text-foreground/80", compact ? "leading-6" : "leading-7")}>
        <p>{t("billing.freeReport")}</p>
        <p>{t("billing.freeCharts")}</p>
        <p>{t("billing.freeAi")}</p>
      </div>
    </Card>
  );
}
