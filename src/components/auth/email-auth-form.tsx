"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthMode = "sign-in" | "sign-up";

function getNameFromEmail(email: string) {
  return email.split("@")[0]?.trim() || "知微用户";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "当前无法完成操作，请稍后再试。";
}

export function EmailAuthForm() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submitLabel = mode === "sign-in" ? "登录" : "创建账号";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!acceptedTerms) {
      setError("请先阅读并同意相关条款。");
      return;
    }

    setError(null);
    setHelperMessage(null);

    startTransition(async () => {
      try {
        if (mode === "sign-in") {
          const result = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard",
            rememberMe: true,
          });

          if (result.error) {
            setError(result.error.message ?? "邮箱或密码不正确。");
            return;
          }
        } else {
          const result = await authClient.signUp.email({
            email,
            password,
            name: getNameFromEmail(email),
            callbackURL: "/dashboard",
            rememberMe: true,
          });

          if (result.error) {
            setError(result.error.message ?? "注册失败，请稍后再试。");
            return;
          }
        }

        window.location.assign("/dashboard");
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));
      }
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 rounded-full bg-[#f6f3ee] p-1">
        <button
          type="button"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            mode === "sign-in"
              ? "bg-white text-[#151515] shadow-[0_8px_20px_-16px_rgba(21,21,21,0.55)]"
              : "text-[#7d746a] hover:text-[#151515]",
          )}
          onClick={() => setMode("sign-in")}
        >
          登录
        </button>
        <button
          type="button"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            mode === "sign-up"
              ? "bg-white text-[#151515] shadow-[0_8px_20px_-16px_rgba(21,21,21,0.55)]"
              : "text-[#7d746a] hover:text-[#151515]",
          )}
          onClick={() => setMode("sign-up")}
        >
          注册
        </button>
      </div>

      <div className="space-y-3">
        <label className="text-base font-medium text-[#1f1b17]" htmlFor="email">
          邮箱
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="example@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-14 rounded-2xl border-[#ded8d0] px-5 text-base placeholder:text-[#aaa39a] focus:border-[#151515]/22"
          required
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="text-base font-medium text-[#1f1b17]" htmlFor="password">
            密码
          </label>
          <button
            type="button"
            className="text-sm text-[#7d746a] transition hover:text-[#151515]"
            onClick={() =>
              setHelperMessage("暂未开放密码找回，可先使用 Google 登录或重新注册。")
            }
          >
            忘记密码？
          </button>
        </div>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            placeholder="至少 8 个字符"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-14 rounded-2xl border-[#ded8d0] px-5 pr-14 text-base placeholder:text-[#aaa39a] focus:border-[#151515]/22"
            minLength={8}
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b847b] transition hover:text-[#151515]"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        <p className="text-sm text-[#8d857c]">至少 8 个字符</p>
      </div>

      <label className="flex items-start gap-3 text-sm leading-7 text-[#5f564d]">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-1 size-5 rounded border border-[#cfc7be] text-[#151515] accent-[#151515]"
        />
        <span>
          我已阅读并同意
          {" "}
          <Link href="/" className="font-medium text-[#151515] underline underline-offset-4">
            用户协议
          </Link>
          {" "}
          和
          {" "}
          <Link href="/" className="font-medium text-[#151515] underline underline-offset-4">
            隐私政策
          </Link>
        </span>
      </label>

      {helperMessage ? <p className="text-sm text-[#8d857c]">{helperMessage}</p> : null}
      {error ? <p className="text-sm text-fire">{error}</p> : null}

      <Button
        type="submit"
        disabled={isPending}
        className="h-14 w-full rounded-2xl bg-[#151515] text-base text-white hover:bg-[#151515]/94"
      >
        {isPending ? "处理中…" : submitLabel}
      </Button>
    </form>
  );
}
