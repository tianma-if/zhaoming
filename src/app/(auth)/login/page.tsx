import Link from "next/link";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAuthSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getAuthSession();
  const user = session?.user ?? null;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f3ee] px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(247,243,238,0.84)_46%,_rgba(232,225,214,0.55)_100%)]" />
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#efe3d4]/65 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#e7ddd0]/60 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <Card className="grain-mask relative w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_40px_120px_-48px_rgba(28,24,20,0.35)] sm:p-8 md:p-10">
          <Link
            href="/"
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-[#ebe5dc] bg-white text-[#595148] transition hover:border-[#151515]/18 hover:text-[#151515]"
            aria-label="返回首页"
          >
            <X className="size-5" />
          </Link>

          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-3 pr-12">
              <p className="text-xs tracking-[0.36em] text-[#9c9287]">AUTH</p>
              <CardTitle className="font-sans text-4xl font-semibold tracking-[-0.03em] text-[#151515]">
                欢迎使用知微
              </CardTitle>
              <CardDescription className="max-w-lg text-base leading-8 text-[#7f756b]">
                登录或注册账号后，即可继续查看命盘、保存测算记录，并逐步接入后续付费与积分体系。
              </CardDescription>
            </div>

            <GoogleSignInButton />

            <div className="flex items-center gap-4 text-sm text-[#9b9185]">
              <Separator className="bg-[#e7e0d6]" />
              <span className="shrink-0">或使用邮箱登录</span>
              <Separator className="bg-[#e7e0d6]" />
            </div>

            <EmailAuthForm />
          </div>
        </Card>
      </div>
    </main>
  );
}
