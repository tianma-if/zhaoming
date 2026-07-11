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
import { useI18n } from "@/components/i18n-provider";

type AuthMode = "sign-in" | "sign-up";

type EmailAuthValues = {
  email: string;
  password: string;
  acceptedTerms: boolean;
};

const defaultValues: EmailAuthValues = {
  email: "",
  password: "",
  acceptedTerms: false,
};

function getNameFromEmail(email: string) {
  return email.split("@")[0]?.trim() || "照命用户";
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

export function EmailAuthForm({ callbackURL = "/divinations" }: { callbackURL?: string }) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const emailAuthSchema = z.object({
    email: z.email(t("auth.invalidEmail")),
    password: z.string().min(8, t("auth.passwordMin")),
    acceptedTerms: z.boolean().refine((value) => value, t("auth.acceptTerms")),
  });
  const form = useForm<EmailAuthValues>({
    resolver: zodResolver(emailAuthSchema),
    defaultValues,
  });

  const submitLabel = mode === "sign-in" ? t("auth.signIn") : t("auth.createAccount");

  function handleSubmit(values: EmailAuthValues) {
    setSubmitError(null);
    setHelperMessage(null);

    startTransition(async () => {
      try {
        if (mode === "sign-in") {
          const result = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL,
          });

          if (result.error) {
            setSubmitError(result.error.message ?? t("auth.invalidCredentials"));
            return;
          }
        } else {
          const result = await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: getNameFromEmail(values.email),
            callbackURL,
          });

          if (result.error) {
            setSubmitError(result.error.message ?? t("auth.signUpFailed"));
            return;
          }
        }

        window.location.assign(callbackURL);
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
            {t("auth.signIn")}
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
            {t("auth.signUp")}
          </button>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base text-[#1f1b17]">{t("auth.email")}</FormLabel>
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
                <FormLabel className="text-base text-[#1f1b17]">{t("auth.password")}</FormLabel>
                <button
                  type="button"
                  className="text-sm text-[#7d746a] transition hover:text-[#151515]"
                  onClick={() =>
                    setHelperMessage(t("auth.forgotHint"))
                  }
                >
                  {t("auth.forgot")}
                </button>
              </div>

              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    placeholder={t("auth.passwordPlaceholder")}
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
              <FormDescription className="text-[#8d857c]">{t("auth.passwordHint")}</FormDescription>
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
                  {t("auth.agree")}
                  {" "}
                  <Link href="/" className="font-medium text-[#151515] underline underline-offset-4">
                    {t("auth.terms")}
                  </Link>
                  {" "}
                  {t("auth.and")}
                  {" "}
                  <Link href="/" className="font-medium text-[#151515] underline underline-offset-4">
                    {t("auth.privacy")}
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
          {isPending ? t("auth.processing") : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
