import { CreditPackGrid } from "@/components/billing/credit-pack-grid";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function PricingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-[1700px] px-6 pb-20 pt-10 md:px-10 md:pt-16">
        <div className="flex justify-center">
          <CreditPackGrid
            gridClassName="w-full max-w-[1380px] lg:grid-cols-4"
            leadingCard={
              <Card
                className={cn(
                  "relative flex h-full flex-col rounded-[2rem] border border-border/70 bg-background/95 p-6 shadow-[0_26px_80px_-58px_rgba(22,20,17,0.45)]",
                )}
              >
                <Badge variant="secondary" className="mb-4 w-fit rounded-full px-3 py-1">
                  Free Access
                </Badge>
                <CardTitle className="text-2xl">免费版</CardTitle>
                <CardDescription className="mt-3 text-sm leading-7">
                  注册后可继续查看排盘结果、基础命盘信息与历史记录，适合先体验产品流程。
                </CardDescription>
                <div className="mt-6 space-y-3 text-sm leading-7 text-foreground/80">
                  <p>新用户赠送 1 次 AI 报告。</p>
                  <p>基础排盘与历史记录继续免费开放。</p>
                  <p>完整 AI 解读仅在需要时按次购买。</p>
                </div>
              </Card>
            }
          />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
