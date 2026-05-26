import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-10 md:px-10 md:pt-20">
        <Card className="rounded-[2rem] border-border/70 bg-background/95 p-8 shadow-[0_28px_80px_-48px_rgba(22,20,17,0.45)]">
          <CardTitle className="text-3xl">支付已提交</CardTitle>
          <CardDescription className="mt-3 text-sm leading-7">
            Stripe 已接收你的支付请求。点数通常会在 webhook 到达后自动入账，刷新个人资料页即可看到最新
            credits。
          </CardDescription>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/profile">查看账户</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/divinations/new">继续测算</Link>
            </Button>
          </div>
        </Card>
      </section>
      <SiteFooter />
    </main>
  );
}
