import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-20 pt-10 md:px-10 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-8">
            <p className="text-xs tracking-[0.36em] text-muted-foreground">
              AI DIVINATION SAAS
            </p>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-display text-6xl leading-none tracking-[0.06em] md:text-8xl">
                用结构化排盘，
                <br />
                让命理回到语言与判断本身。
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                知微将八字、纳音五行、紫微斗数等传统系统的底层排盘能力，与现代大模型的解释能力结合，形成一种更克制、更清晰、更高级的阅读体验。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/divinations/new">
                <Button size="lg">开始测算</Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline">
                  查看内容样式
                </Button>
              </Link>
            </div>
          </div>

          <Card className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.28em] text-muted-foreground">
                CORE SYSTEMS
              </p>
              <p className="font-display text-3xl tracking-[0.08em]">
                Bazi / Zi Wei / AI Reading
              </p>
            </div>
            <div className="grid gap-5 text-sm leading-7 text-muted-foreground">
              <p>排盘层：`lunar-typescript` 与 `iztro` 负责标准化命盘生成。</p>
              <p>解释层：Vercel AI SDK 负责流式输出与多 Provider 接口抽象。</p>
              <p>业务层：Supabase 管理鉴权、记录、RLS 和后续订阅积分体系。</p>
            </div>
          </Card>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
