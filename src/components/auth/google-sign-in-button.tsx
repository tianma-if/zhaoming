"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.6 12.227c0-.818-.073-1.605-.209-2.364H12v4.474h5.382a4.604 4.604 0 0 1-1.996 3.021v2.51h3.236c1.893-1.742 2.978-4.31 2.978-7.64Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.619-2.43l-3.236-2.51c-.895.6-2.037.954-3.383.954-2.602 0-4.807-1.758-5.594-4.12H3.06v2.59A9.998 9.998 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.406 13.894A5.997 5.997 0 0 1 6.093 12c0-.657.116-1.294.313-1.894v-2.59H3.06A9.998 9.998 0 0 0 2 12c0 1.61.387 3.13 1.06 4.484l3.346-2.59Z"
        fill="#FBBC04"
      />
      <path
        d="M12 5.986c1.469 0 2.787.505 3.826 1.496l2.869-2.87C16.96 2.983 14.697 2 12 2a9.998 9.998 0 0 0-8.94 5.516l3.346 2.59c.787-2.362 2.992-4.12 5.594-4.12Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleSignInButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(result.error.message ?? "Google 登录暂时不可用。");
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Google 登录暂时不可用。",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className={cn(
          "h-14 w-full rounded-2xl border-[#ded8d0] bg-white text-base text-[#151515] shadow-[0_10px_30px_-24px_rgba(21,21,21,0.3)] hover:bg-[#fbfaf8]",
          className,
        )}
        onClick={handleSignIn}
        disabled={isLoading}
      >
        <span className="mr-3">
          <GoogleMark />
        </span>
        {isLoading ? "正在跳转…" : "使用谷歌账号登录"}
      </Button>
      {error ? <p className="text-sm text-fire">{error}</p> : null}
    </div>
  );
}
