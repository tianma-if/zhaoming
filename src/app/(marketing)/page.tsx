import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const methods = [
  {
    title: "AI 智能，辅助解析",
    body:
      "先把命盘结构生成准确，再交给 AI 做自然语言解释。重点不是神秘化，而是把信息整理清楚。",
  },
  {
    title: "传统系统，现代阅读",
    body:
      "八字与紫微不再以嘈杂页面呈现，而是回到更安静、更高级、更适合思考的阅读方式。",
  },
  {
    title: "从命盘进入判断",
    body:
      "知微不会替你做决定。我们提供一张结构化命盘与一段可阅读解释，判断仍然属于你自己。",
  },
];

const trustPoints = [
  "先排盘，后解读，避免直接生成空泛文案",
  "极简排版，适合长时间阅读与思考",
  "支持八字与紫微，后续持续扩展命理系统",
];

const process = [
  {
    step: "01",
    title: "输入出生信息",
    body: "用尽可能少的步骤完成基础信息输入，避免把用户困在复杂术语里。",
  },
  {
    step: "02",
    title: "生成结构命盘",
    body: "先得到结构化盘面，再决定重点看哪里，而不是直接输出结论。",
  },
  {
    step: "03",
    title: "进入 AI 阅读",
    body: "围绕你的真实问题展开解释，把信息组织成更适合阅读的语言。",
  },
];

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:px-10 md:pt-18">
        <div className="section-surface grain-mask overflow-hidden rounded-[2.2rem] border border-white/65 px-6 py-8 shadow-[0_30px_80px_-48px_rgba(22,20,17,0.22)] md:px-10 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_20rem] lg:items-end">
            <div className="space-y-8">
              <div className="space-y-5">
                <Badge>AI DIVINATION</Badge>
                <div className="space-y-4">
                  <h1 className="font-display text-6xl leading-[0.92] tracking-[0.04em] md:text-8xl">
                    知微
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-2xl">
                    先看命盘结构，再进入语言解释。
                    <br className="hidden md:block" />
                    把传统命理转换成更克制、更现代的阅读体验。
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <Link href="/divinations/new">
                  <Button size="lg" className="min-w-48">
                    开始一次测算
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button size="lg" variant="outline" className="min-w-48">
                    先看阅读样例
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.3rem] border border-border/80 bg-white/72 px-4 py-4 text-sm leading-7 text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Card className="section-surface space-y-5 rounded-[1.8rem] border-border/80 p-6 shadow-none">
              <div className="space-y-2">
                <p className="text-xs tracking-[0.28em] text-muted-foreground">
                  STRUCTURE BEFORE INTERPRETATION
                </p>
                <p className="font-display text-4xl leading-[1.35] tracking-[0.03em]">
                  排盘不是宣告命运，
                  <br />
                  而是帮助你看见结构。
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-end justify-between border-b border-border/70 pb-3">
                  <div>
                    <p className="text-xs tracking-[0.28em] text-muted-foreground">当前支持</p>
                    <p className="mt-2 text-lg">八字 / 紫微斗数</p>
                  </div>
                  <p className="font-display text-4xl">2</p>
                </div>
                <div className="flex items-end justify-between border-b border-border/70 pb-3">
                  <div>
                    <p className="text-xs tracking-[0.28em] text-muted-foreground">阅读方式</p>
                    <p className="mt-2 text-lg">结构命盘 + AI 解读</p>
                  </div>
                  <p className="font-display text-4xl">2-step</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs tracking-[0.28em] text-muted-foreground">设计方向</p>
                    <p className="mt-2 text-lg">低饱和 / 排印优先</p>
                  </div>
                  <p className="font-display text-4xl">Calm</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 pb-8 md:px-10">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_minmax(0,1.1fr)]">
          <Card className="section-surface space-y-5 rounded-[1.8rem] p-7">
            <div className="space-y-3">
              <p className="text-xs tracking-[0.36em] text-muted-foreground">适合谁</p>
              <CardTitle className="text-3xl tracking-[0.04em]">
                适合想认真看清问题的人
              </CardTitle>
            </div>
            <CardDescription className="text-base leading-8">
              如果你不喜欢传统命理站点的噪音感、神秘化和信息堆砌，而更想得到一份清楚、可阅读、可反思的结构说明，这套界面就是为你准备的。
            </CardDescription>
          </Card>

          <div className="grid gap-5 md:grid-cols-3">
            {process.map((item) => (
              <Card
                key={item.step}
                className="section-surface space-y-4 rounded-[1.6rem] border-border/80 p-6"
              >
                <p className="text-xs tracking-[0.36em] text-muted-foreground">{item.step}</p>
                <CardTitle className="text-2xl tracking-[0.03em]">{item.title}</CardTitle>
                <CardDescription className="leading-8">{item.body}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <section className="space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-xs tracking-[0.36em] text-muted-foreground">核心理念</p>
            <h2 className="font-display text-4xl tracking-[0.06em] md:text-5xl">
              更克制，也更清楚
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {methods.map((item) => (
              <Card
                key={item.title}
                className="section-surface space-y-4 rounded-[1.4rem] border border-border/80 p-6 text-left shadow-[0_14px_28px_-28px_rgba(22,20,17,0.12)]"
              >
                <Badge className="w-fit">{item.title}</Badge>
                <CardTitle className="text-2xl tracking-[0.03em]">{item.title}</CardTitle>
                <CardDescription className="text-sm leading-8">
                  {item.body}
                </CardDescription>
              </Card>
            ))}
          </div>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
