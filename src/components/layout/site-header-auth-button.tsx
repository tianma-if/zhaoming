"use client";

import Link from "next/link";
import { useAuthTransitionPending } from "@/components/auth/auth-transition-state";
import { Button } from "@/components/ui/button";

export function SiteHeaderAuthButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pending = useAuthTransitionPending();

  if (isAuthenticated) {
    return (
      <Link href="/divinations">
        <Button>进入工作台</Button>
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
        {pending ? "登录中…" : "登录"}
      </Button>
    </Link>
  );
}
