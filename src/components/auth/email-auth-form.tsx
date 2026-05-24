"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type AuthMode = "sign-in" | "sign-up";

const emailAuthSchema = z.object({
  email: z.email("请输入有效的邮箱地址。"),
  password: z.string().min(8, "密码至少 8 个字符。"),
  acceptedTerms: z.boolean().refine((value) => value, "请先阅读并同意相关条款。"),
});

type EmailAuthValues = z.infer<typeof emailAuthSchema>;

const defaultValues: EmailAuthValues = {
  email: "",
  password: "",
  acceptedTerms: false,
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<EmailAuthValues>({
    resolver: zodResolver(emailAuthSchema),
    defaultValues,
  });

  const submitLabel = mode === "sign-in" ? "登录" : "创建账号";

  function handleSubmit(values: EmailAuthValues) {
    setSubmitError(null);
    setHelperMessage(null);

    startTransition(async () => {
      try {
        if (mode === "sign-in") {
          const result = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/divinations",
          });

          if (result.error) {
            setSubmitError(result.error.message ?? "邮箱或密码不正确。");
            return;
          }
        } else {
          const result = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: getNameFromEmail(values.email),
            callbackURL: "/divinations",
          });

          if (result.error) {
            setSubmitError(result.error.message ?? "注册失败，请稍后再试。");
            return;
          }
        }

        window.location.assign("/divinations");
      } catch (caughtError) {
        setSubmitError(getErrorMessage(caughtError));
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base text-[#1f1b17]">邮箱</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  placeholder="example@example.com"
                  className="h-14 rounded-2xl border-[#ded8d0] px-5 text-base placeholder:text-[#aaa39a] focus:border-[#151515]/22"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <FormLabel className="text-base text-[#1f1b17]">密码</FormLabel>
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
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    placeholder="至少 8 个字符"
                    className="h-14 rounded-2xl border-[#ded8d0] px-5 pr-14 text-base placeholder:text-[#aaa39a] focus:border-[#151515]/22"
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b847b] transition hover:text-[#151515]"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              <FormDescription className="text-[#8d857c]">至少 8 个字符</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptedTerms"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <label className="flex items-start gap-3 text-sm leading-7 text-[#5f564d]">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
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
              <FormMessage />
            </FormItem>
          )}
        />

        {helperMessage ? <p className="text-sm text-[#8d857c]">{helperMessage}</p> : null}
        {submitError ? <p className="text-sm text-fire">{submitError}</p> : null}

        <Button
          type="submit"
          disabled={isPending}
          className="h-14 w-full rounded-2xl bg-[#151515] text-base text-white hover:bg-[#151515]/94"
        >
          {isPending ? "处理中…" : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
