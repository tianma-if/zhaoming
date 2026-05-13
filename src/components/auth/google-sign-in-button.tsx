"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button className="w-full" onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? "正在跳转…" : "使用 Google 登录"}
    </Button>
  );
}
