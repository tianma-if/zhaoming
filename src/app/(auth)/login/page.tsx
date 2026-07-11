import Link from "next/link";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAuthSession } from "@/lib/auth/session";
import { getAuthMode, hasGoogleOAuthEnv } from "@/lib/env";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

function normalizeCallbackUrl(callbackURL?: string) {
  if (!callbackURL?.startsWith("/") || callbackURL.startsWith("//")) {
    return "/divinations";
  }

  return callbackURL;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL?: string }>;
}) {
  const { callbackURL } = await searchParams;
  const nextUrl = normalizeCallbackUrl(callbackURL);
  const session = await getAuthSession();
  const user = session?.user ?? null;

  if (user) {
    redirect(nextUrl);
  }

  const isOauth = getAuthMode() === "oauth" && hasGoogleOAuthEnv();
  const locale = await getLocale();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#27272a] px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(161,161,170,0.2),_rgba(63,63,70,0.52)_42%,_rgba(39,39,42,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_32%,transparent_74%,rgba(255,255,255,0.04))]" />
      <div className="absolute left-[-8%] top-[-6%] h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-6%] h-96 w-96 rounded-full bg-white/7 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <Card className="relative w-full max-w-2xl rounded-[2rem] border border-black/6 bg-white p-6 shadow-[0_40px_120px_-48px_rgba(28,24,20,0.28)] sm:p-8 md:p-10">
          <Link
            href="/"
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-[#ebe5dc] bg-white text-[#595148] transition hover:border-[#151515]/18 hover:text-[#151515]"
            aria-label={translate(locale, "auth.backHome")}
          >
            <X className="size-5" />
          </Link>

          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-3 pr-12">
              <p className="text-xs tracking-[0.36em] text-[#9c9287]">AUTH</p>
              <CardTitle className="font-sans text-4xl font-semibold tracking-[-0.03em] text-[#151515]">
                {translate(locale, "auth.welcome")}
              </CardTitle>
              <CardDescription className="max-w-lg text-base leading-8 text-[#7f756b]">
                {translate(locale, "auth.description")}
              </CardDescription>
            </div>

            {isOauth && (
              <>
                <GoogleSignInButton callbackURL={nextUrl} />
                <div className="flex w-full items-center gap-4 text-sm text-[#9b9185]">
                  <Separator className="min-w-0 flex-1 bg-[#e7e0d6]" />
                  <span className="shrink-0">{translate(locale, "auth.orEmail")}</span>
                  <Separator className="min-w-0 flex-1 bg-[#e7e0d6]" />
                </div>
              </>
            )}

            <EmailAuthForm callbackURL={nextUrl} />
          </div>
        </Card>
      </div>
    </main>
  );
}
