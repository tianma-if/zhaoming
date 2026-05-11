"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
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
