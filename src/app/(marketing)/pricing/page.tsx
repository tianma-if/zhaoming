import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function PricingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-10 md:px-10 md:pt-20">
        <div className="space-y-4">
          <p className="text-xs tracking-[0.36em] text-muted-foreground">PRICING</p>
          <h1 className="font-display text-6xl tracking-[0.06em]">定价结构预留</h1>
          <p className="max-w-2xl text-sm leading-8 text-muted-foreground">
            当前阶段先打通积分和订阅字段、Stripe Webhook 路由与 credits 占位逻辑，后续可直接接入付费墙。
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardTitle>Free</CardTitle>
            <CardDescription>适合产品早期内测与体验流量。</CardDescription>
          </Card>
          <Card>
            <CardTitle>Pro</CardTitle>
            <CardDescription>用于承接 Stripe 订阅与更高额度的 AI 解盘调用。</CardDescription>
          </Card>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
