import { CreditPackGrid } from "@/components/billing/credit-pack-grid";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function PricingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-10 md:pt-20">
        <div className="space-y-4">
          <p className="text-xs tracking-[0.36em] text-muted-foreground">PRICING</p>
          <h1 className="font-display text-5xl tracking-[0.06em] md:text-6xl">
            选择适合你的 AI 报告次数包
          </h1>
          <p className="max-w-2xl text-sm leading-8 text-muted-foreground">
            排盘与基础命盘信息继续免费开放，只有完整 AI 报告按次计费。选择套餐后会跳转到 Stripe
            Hosted Checkout 完成支付。
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="rounded-[2rem] border-border/70 bg-[#f6f2ea] p-7 shadow-[0_26px_80px_-52px_rgba(22,20,17,0.45)]">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              Free Access
            </Badge>
            <CardTitle className="mt-5 text-3xl">基础排盘永久免费</CardTitle>
            <CardDescription className="mt-3 text-sm leading-7 text-muted-foreground">
              注册后可继续查看排盘结果、基础命盘信息与历史记录。只有完整 AI 解读报告会消耗次数。
            </CardDescription>

            <div className="mt-8 space-y-3 text-sm leading-7 text-foreground/80">
              <p>新用户赠送 1 次 AI 报告。</p>
              <p>1 次 = 生成 1 份完整 AI 命理分析报告。</p>
              <p>支付完成后，次数会自动入账到当前登录账户。</p>
            </div>
          </Card>

          <CreditPackGrid />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
