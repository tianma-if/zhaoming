"use client";

import Link from "next/link";
import { useAuthTransitionPending } from "@/components/auth/auth-transition-state";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export function SiteHeaderAuthButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pending = useAuthTransitionPending();
  const { t } = useI18n();

  if (isAuthenticated) {
    return (
      <Link href="/divinations">
        <Button>{t("nav.workspace")}</Button>
      </Link>
    );
  }

  return (
    <Link
      href={pending ? "#" : "/login"}
      aria-disabled={pending}
      className={pending ? "pointer-events-none" : undefined}
    >
      <Button variant="outline" disabled={pending}>
        {pending ? t("nav.loginPending") : t("nav.login")}
      </Button>
    </Link>
  );
}
