import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-10 md:px-10 md:pt-20">
        <Card className="rounded-[2rem] border-border/70 bg-background/95 p-8 shadow-[0_28px_80px_-48px_rgba(22,20,17,0.45)]">
          <CardTitle className="text-3xl">已取消支付</CardTitle>
          <CardDescription className="mt-3 text-sm leading-7">
            本次支付还没有完成，你可以随时重新选择套餐继续。
          </CardDescription>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/pricing">返回定价页</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/divinations/new">先继续体验免费功能</Link>
            </Button>
          </div>
        </Card>
      </section>
      <SiteFooter />
    </main>
  );
}
