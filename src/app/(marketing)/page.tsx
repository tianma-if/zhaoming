import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const principles = [
  {
    title: "先排盘，再阅读",
    body:
      "我们先生成标准化命盘，再进入解释阶段。判断建立在结构之上，而不是建立在措辞之上。",
  },
  {
    title: "克制比玄化更重要",
    body:
      "不过度承诺，不制造情绪威压。知微更像一位冷静的阅读者，而不是一个喧闹的宣判者。",
  },
  {
    title: "把命理还给语言",
    body:
      "真正重要的不是术语堆砌，而是把复杂系统翻译成可以理解、可以比较、可以思考的表达。",
  },
];

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-24 pt-8 md:px-10 md:gap-28 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
          <div className="space-y-8 md:space-y-10">
            <p className="text-xs tracking-[0.42em] text-muted-foreground">
              AI DIVINATION STUDIO
            </p>
            <div className="space-y-6">
              <h1 className="max-w-5xl font-display text-6xl leading-[0.94] tracking-[0.04em] md:text-[7.5rem]">
                用结构化排盘，
                <br />
                让命理重新成为
                <br />
                一种可阅读的判断。
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                知微将八字、纳音五行、紫微斗数等传统系统的底层排盘能力，与现代大模型的语言解释能力结合，形成一种更克制、更清晰、更接近真实阅读的体验。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/divinations/new">
                <Button size="lg">开始测算</Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline">
                  阅读方法与样例
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4 border-l border-border/80 pl-0 text-sm text-muted-foreground lg:pl-8">
            <p className="text-xs tracking-[0.32em]">METHOD</p>
            <p className="leading-8">
              排盘负责给出结构，
              <br />
              语言负责提供解释，
              <br />
              人最终完成判断。
            </p>
          </div>
        </div>

        <section className="mx-auto w-full max-w-4xl">
          <Card className="grain-mask relative overflow-hidden rounded-[2.4rem] border-white/45 bg-white/58 px-7 py-9 md:px-12 md:py-12">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-black/8 to-transparent" />
            <p className="text-center font-display text-3xl leading-[1.5] tracking-[0.04em] md:text-5xl">
              排盘不是结论本身。
              <br />
              它只是把隐藏的秩序，
              <br />
              交回语言去辨认。
            </p>
            <p className="mt-6 text-center text-xs tracking-[0.32em] text-muted-foreground">
              ZHI WEI / READING BEFORE JUDGMENT
            </p>
          </Card>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.36em] text-muted-foreground">
              READING PRINCIPLES
            </p>
            <h2 className="font-display text-4xl tracking-[0.08em] md:text-6xl">
              我们如何理解命理
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              知微并不试图把传统系统包装成神谕，而是把它整理成一种可以被阅读、被比较、被反思的方法。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((item) => (
              <Card
                key={item.title}
                className="space-y-6 rounded-[2rem] border-white/40 bg-white/40 p-7 shadow-none"
              >
                <p className="text-xs tracking-[0.28em] text-muted-foreground">
                  PRINCIPLE
                </p>
                <div className="space-y-4">
                  <h3 className="font-display text-3xl leading-tight tracking-[0.04em]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-8 text-muted-foreground">{item.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6 border-t border-border/80 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.36em] text-muted-foreground">
              BEGIN WITH ONE CHART
            </p>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              现在从八字开始。先得到一张安静、清楚、可阅读的命盘，再决定你要怎样理解它。
            </p>
          </div>
          <Link href="/divinations/new">
            <Button size="lg">进入测算</Button>
          </Link>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
