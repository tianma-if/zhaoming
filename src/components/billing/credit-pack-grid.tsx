import { BadgeCheck } from "lucide-react";
import { CheckoutPlanButton } from "@/components/billing/checkout-plan-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { creditPacks } from "@/lib/billing/plans";
import { cn } from "@/lib/utils";

export function CreditPackGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("grid gap-4", compact ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2")}>
      {creditPacks.map((pack) => (
        <Card
          key={pack.id}
          className={cn(
            "relative flex flex-col border",
            compact
              ? "min-h-[18rem] rounded-[1.25rem] bg-card p-5 shadow-[0_18px_44px_-34px_rgba(22,20,17,0.3)]"
              : "rounded-[2rem] p-6 shadow-[0_26px_80px_-58px_rgba(22,20,17,0.45)]",
            pack.recommended
              ? compact
                ? "border-foreground ring-1 ring-foreground/10"
                : "border-foreground bg-card"
              : compact
                ? "border-border"
                : "border-border/70 bg-background/95",
          )}
        >
          {pack.recommended ? (
            <Badge
              className={cn(
                "w-fit rounded-full px-3 py-1",
                compact && "absolute right-4 top-4 gap-1 rounded-md px-2.5 py-1",
              )}
            >
              {compact ? <BadgeCheck className="size-3.5" /> : null}
              推荐
            </Badge>
          ) : null}

          <CardTitle className={compact ? "text-lg" : "text-2xl"}>{pack.name}</CardTitle>
          <CardDescription className={cn("mt-3 text-sm", compact ? "leading-6" : "leading-7")}>
            {pack.description}
          </CardDescription>

          <div className={compact ? "space-y-3" : "mt-6"}>
            <div className="flex items-end gap-2">
              <span className={cn("font-semibold tracking-tight", compact ? "text-3xl" : "text-4xl")}>
                {pack.priceLabel}
              </span>
              <span className="pb-1 text-sm text-muted-foreground">/ {pack.creditsLabel}</span>
            </div>
            <p className={cn("text-xs text-muted-foreground", !compact && "mt-2")}>
              {pack.unitPriceLabel}
            </p>
          </div>

          <CheckoutPlanButton
            planId={pack.id}
            className={compact ? "mt-auto" : "mt-8"}
            buttonClassName={cn("w-full", compact ? "rounded-md" : "h-11 rounded-xl")}
          />
        </Card>
      ))}
    </div>
  );
}
