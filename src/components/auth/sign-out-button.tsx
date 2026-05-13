"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, type ButtonProps } from "@/components/ui/button";

export function SignOutButton({
  children = "退出登录",
  ...props
}: ButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setIsPending(true);
    setError(null);

    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "退出登录失败，请重试。");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleSignOut} disabled={isPending} {...props}>
        {isPending ? "退出中..." : children}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
