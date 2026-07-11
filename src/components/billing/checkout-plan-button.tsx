"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CreditPackId } from "@/lib/billing/plans";
import { useI18n } from "@/components/i18n-provider";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to open checkout. Please try again later.";
}

type BillingCheckoutResponse = {
  error?: string;
  loginUrl?: string;
  provider?: "stripe";
  mode?: "redirect";
  checkoutUrl?: string;
};

export function CheckoutPlanButton({
  planId,
  buttonClassName,
  className,
}: {
  planId: CreditPackId;
  buttonClassName?: string;
  className?: string;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    setSubmitError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId,
            returnPath: pathname ?? "/divinations",
          }),
        });

        const payload = (await response.json()) as BillingCheckoutResponse;

        if (response.status === 401 && payload.loginUrl) {
          router.push(payload.loginUrl);
          return;
        }

        if (!response.ok || !payload.provider || !payload.mode) {
          setSubmitError(payload.error ?? t("billing.orderError"));
          return;
        }

        if (payload.mode === "redirect") {
          if (!payload.checkoutUrl) {
            setSubmitError(t("billing.urlError"));
            return;
          }

          window.location.assign(payload.checkoutUrl);
          return;
        }
      } catch (error) {
        setSubmitError(getErrorMessage(error));
      }
    });
  }

  return (
    <div className={className ? `${className} space-y-2` : "space-y-2"}>
      <Button
        className={buttonClassName}
        size="sm"
        disabled={isPending}
        onClick={handleCheckout}
      >
        {isPending ? t("billing.redirecting") : t("billing.choose")}
      </Button>
      {submitError ? <p className="text-xs text-fire">{submitError}</p> : null}
    </div>
  );
}
