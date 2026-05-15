import Link from "next/link";
import { ArrowUpRight, Bot, BookOpenText, Orbit, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const philosophy = [
  {
    title: "先还原结构，再讨论解释",
    body:
      "先完成命盘生成与关键信息整理，再把复杂术语转成现代语言，避免一上来就掉进神秘化表达。",
  },
  {
    title: "像读一份分析报告，而不是一张神秘海报",
    body:
      "排版、层级与留白都为阅读服务，让八字与紫微回到真正可被理解、可被思考的状态。",
  },
  {
    title: "答案不替代判断",
    body:
      "知微把命理当作观察自我的工具，而不是代替你做决定的权威。系统提供参考，结论仍属于你自己。",
  },
];

const systems = [
  {
    title: "八字命盘",
    body: "输入出生信息，生成四柱结构、五行关系与适合继续阅读的 AI 解读入口。",
    href: "/divinations/new",
    cta: "开始测算",
  },
  {
    title: "紫微斗数",
    body: "以更现代的网格化呈现方式展示命宫结构，让信息密度高但阅读负担更低。",
    href: "/divinations/new",
    cta: "查看体验",
  },
  {
    title: "流式 AI 解盘",
    body: "不是一次性抛出大段玄学文案，而是围绕命盘结构逐步生成可读、可追踪的解释。",
    href: "/blog",
    cta: "阅读样例",
  },
  {
    title: "内容与方法沉淀",
    body: "通过博客持续沉淀命理知识、术语解释与案例拆解，让产品不只提供结果，也提供理解路径。",
    href: "/blog",
    cta: "进入博客",
  },
];

const scenarios = [
  "我想先认识自己的性格结构与长期倾向",
  "我在做职业、关系或阶段选择，想获得一个更冷静的观察视角",
  "我对传统命理感兴趣，但不想使用旧式、嘈杂、带强烈迷信感的网站",
];

const steps = [
  {
    index: "01",
    title: "输入出生信息",
    body: "以尽可能准确的时间信息完成排盘基础输入。",
  },
  {
    index: "02",
    title: "查看结构化命盘",
    body: "先看到盘面、五行与关键信息，再决定想深入的方向。",
  },
  {
    index: "03",
    title: "获得 AI 可读解释",
    body: "把传统命理语言转译为更适合现代阅读与思考的分析文本。",
  },
];

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="grain-mask relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(133,113,92,0.12),transparent_58%),linear-gradient(180deg,rgba(246,246,244,0.95),rgba(255,255,255,0))]" />
        <SiteHeader />

        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-24 pt-8 md:px-10 md:pb-28 md:pt-14 lg:grid-cols-[minmax(0,1.1fr)_26rem] lg:items-end">
          <div className="space-y-8">
            <div className="space-y-5">
              <Badge>AI DIVINATION SYSTEM</Badge>
              <div className="space-y-5">
                <h1 className="max-w-4xl font-display text-5xl leading-[0.96] tracking-[0.04em] md:text-7xl lg:text-[5.5rem]">
                  把东方命理重新整理，
                  <br />
                  成适合现代人的阅读体验。
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  知微把八字、紫微与 AI 解读整理成更克制、更清晰、更值得停留的体验。
                  不是神秘化地宣布答案，而是先给你结构，再给你解释。
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/divinations/new">
                <Button size="lg" className="min-w-44">
                  开始排盘
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="min-w-44">
                  看解读样例
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-[1.6rem] border-white/70 bg-white/80 p-6 backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <Badge className="bg-transparent">主入口</Badge>
                  <Orbit className="size-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-[1.9rem] tracking-[0.04em]">八字命盘</CardTitle>
                <CardDescription className="mt-3 text-sm leading-8">
                  从出生时间生成四柱与五行结构，再交由 AI
                  做自然语言解释，适合第一次进入知微的用户。
                </CardDescription>
              </Card>

              <Card className="rounded-[1.6rem] border-white/70 bg-[#f8f6f2]/88 p-6 backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <Badge className="bg-transparent">进阶入口</Badge>
                  <Sparkles className="size-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-[1.9rem] tracking-[0.04em]">紫微斗数</CardTitle>
                <CardDescription className="mt-3 text-sm leading-8">
                  用更视觉化的宫位结构承载传统体系，适合希望更深入理解个人命盘格局的用户。
                </CardDescription>
              </Card>
            </div>
          </div>

          <Card className="rounded-[2rem] border-white/70 bg-white/76 p-7 backdrop-blur">
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge className="bg-transparent">结构优先</Badge>
                <h2 className="font-display text-3xl leading-tight tracking-[0.05em]">
                  像一份清晰的分析入口，
                  <br />
                  而不是一页嘈杂的术语堆叠。
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.4rem] border border-border bg-background/72 p-4">
                  <p className="text-xs tracking-[0.26em] text-muted-foreground">
                    INPUT
                  </p>
                  <p className="mt-2 text-sm leading-7">
                    出生年 / 月 / 日 / 时
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-border bg-background/72 p-4">
                  <p className="text-xs tracking-[0.26em] text-muted-foreground">
                    STRUCTURE
                  </p>
                  <p className="mt-2 text-sm leading-7">
                    命盘、五行、宫位、关系与阶段线索
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-border bg-background/72 p-4">
                  <p className="text-xs tracking-[0.26em] text-muted-foreground">
                    READING
                  </p>
                  <p className="mt-2 text-sm leading-7">
                    AI 将传统术语翻译成更易读的现代说明
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[1.4rem] border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                <span>适合第一次接触命理，也适合回头细读。</span>
                <Bot className="size-4 shrink-0" />
              </div>
            </div>
          </Card>
        </section>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.34em] text-muted-foreground">核心理念</p>
            <h2 className="font-display text-4xl tracking-[0.05em] md:text-5xl">
              更克制，也更清楚。
              <br />
              让理解先于神秘感。
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-8 text-muted-foreground">
            命理产品真正重要的，不只是能不能排盘，而是能不能把复杂体系整理成可理解、可阅读、可继续探索的体验。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {philosophy.map((item) => (
            <Card
              key={item.title}
              className="rounded-[1.6rem] p-6"
            >
              <Badge className="mb-5 w-fit bg-transparent">PHILOSOPHY</Badge>
              <CardTitle className="text-[1.8rem] leading-tight tracking-[0.04em]">
                {item.title}
              </CardTitle>
              <CardDescription className="mt-4 text-sm leading-8">
                {item.body}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/58 py-20">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="mb-10 space-y-3">
            <p className="text-xs tracking-[0.34em] text-muted-foreground">分析系统</p>
            <h2 className="font-display text-4xl tracking-[0.05em] md:text-5xl">
              从基础排盘到深入阅读，
              <br />
              首页本身就是一条探索路径。
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {systems.map((item) => (
              <Card
                key={item.title}
                className="flex h-full flex-col justify-between rounded-[1.6rem] bg-white p-6"
              >
                <div>
                  <Badge className="mb-5 w-fit bg-transparent">SYSTEM</Badge>
                  <CardTitle className="text-[1.9rem] tracking-[0.04em]">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mt-4 max-w-lg text-sm leading-8">
                    {item.body}
                  </CardDescription>
                </div>
                <Link
                  href={item.href}
                  className="mt-8 inline-flex items-center gap-2 text-sm tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
                >
                  {item.cta}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-20 md:px-10 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="rounded-[1.8rem] bg-[#f8f6f2] p-7">
          <Badge className="bg-transparent">适用场景</Badge>
          <h2 className="mt-5 font-display text-4xl tracking-[0.05em]">
            你也许不是想“算命”，
            <br />
            而是想看清一些事。
          </h2>
          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            知微不把功能单独摆出来，而是让不同的问题、阶段与好奇心，都能自然找到合适的入口。
          </p>
        </Card>

        <div className="grid gap-4">
          {scenarios.map((item, index) => (
            <Card key={item} className="rounded-[1.6rem] p-6">
              <p className="text-xs tracking-[0.28em] text-muted-foreground">
                SCENARIO {index + 1}
              </p>
              <p className="mt-3 text-base leading-8">{item}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.34em] text-muted-foreground">使用流程</p>
            <h2 className="font-display text-4xl tracking-[0.05em] md:text-5xl">
              用最少的步骤进入，
              <br />
              用更完整的结构理解自己。
            </h2>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            查看定价与后续能力
            <BookOpenText className="size-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((item) => (
            <Card key={item.index} className="rounded-[1.6rem] p-6">
              <p className="text-xs tracking-[0.32em] text-muted-foreground">
                STEP {item.index}
              </p>
              <CardTitle className="mt-4 text-[1.8rem] tracking-[0.04em]">
                {item.title}
              </CardTitle>
              <CardDescription className="mt-4 text-sm leading-8">
                {item.body}
              </CardDescription>
            </Card>
          ))}
        </div>

        <Card className="mt-8 rounded-[2rem] border-white/70 bg-[linear-gradient(135deg,rgba(248,246,242,0.95),rgba(255,255,255,1))] p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-4">
              <Badge className="bg-transparent">FINAL CTA</Badge>
              <h2 className="font-display text-4xl tracking-[0.05em] md:text-5xl">
                从命盘出发，
                <br />
                重新理解你正在经历的人生结构。
              </h2>
              <p className="text-sm leading-8 text-muted-foreground">
                无论你是第一次接触东方命理，还是已经有自己的体系判断，知微都希望提供一个更安静、但更有解释力的入口。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/divinations/new">
                <Button size="lg" className="min-w-44">
                  进入体验
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="min-w-44">
                  继续浏览
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      <SiteFooter />
    </main>
  );
}
