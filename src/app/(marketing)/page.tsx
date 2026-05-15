import Link from "next/link";
import {
  Brain,
  ChevronRight,
  Lightbulb,
  Quote,
  Sparkles,
  Target,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const philosophy = [
  {
    title: "AI 智能，理性辅助",
    body:
      "先完成命盘生成，再由 AI 用更易读的方式解释盘面结构，帮助你把复杂术语转成可理解的信息。",
    icon: Brain,
  },
  {
    title: "传统体系，现代阅读",
    body:
      "八字与紫微不再依赖旧式命理网站的嘈杂表达，而是回到更清楚、更克制的页面层级与排版之中。",
    icon: Lightbulb,
  },
  {
    title: "自我探索，独立判断",
    body:
      "我们更在意帮助你看清结构，而不是替你宣告结论。参考可以被提供，判断仍然应当属于你自己。",
    icon: Sparkles,
  },
];

const systems = [
  {
    title: "八字分析",
    body: "基于出生信息生成四柱命盘，查看五行关系、结构特点与 AI 解读。",
    href: "/divinations/new",
    cta: "开始分析",
  },
  {
    title: "紫微斗数",
    body: "生成紫微命盘，查看宫位与主星分布，用更现代的方式理解传统结构。",
    href: "/divinations/new",
    cta: "进入体验",
  },
  {
    title: "博客样例",
    body: "通过实际解读样例了解知微的表达方式、页面风格与命理内容组织。",
    href: "/blog",
    cta: "阅读样例",
  },
  {
    title: "后续能力",
    body: "查看产品路线、套餐与可扩展系统，理解知微接下来会提供什么能力。",
    href: "/pricing",
    cta: "查看定价",
  },
];

export default async function HomePage() {
  const interactiveCardClassName =
    "group transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#111111] hover:shadow-[0_24px_44px_-30px_rgba(17,17,17,0.28)]";

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-10 text-center md:px-10 md:pb-24 md:pt-20">
        <h1 className="font-display text-[4.3rem] leading-[0.95] tracking-[0.01em] text-foreground md:text-[6.6rem]">
          知微
        </h1>
        <p className="mt-5 text-2xl text-[#7d7d7d] md:text-[2rem]">
          AI 驱动的东方命理分析系统
        </p>

        <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:gap-8">
          <div className="space-y-3 text-left">
            <Link href="/divinations/new">
              <Button
                size="lg"
                className="h-14 min-w-60 rounded-2xl bg-[#111111] px-7 text-lg text-white hover:bg-[#111111]/95"
              >
                八字分析
                <ChevronRight className="ml-2 size-5" />
              </Button>
            </Link>
            <p className="pl-3 text-base text-[#8a8a8a]">命盘结构解读</p>
          </div>

          <div className="hidden h-12 w-px bg-[#e6e6e6] md:block" />

          <div className="space-y-3 text-left">
            <Link href="/divinations/new">
              <Button
                size="lg"
                variant="outline"
                className="h-14 min-w-60 rounded-2xl border-[#bfbfbf] bg-white px-7 text-lg text-[#111111] hover:bg-[#fafafa]"
              >
                紫微斗数
                <ChevronRight className="ml-2 size-5" />
              </Button>
            </Link>
            <p className="pl-3 text-base text-[#8a8a8a]">命宫格局阅读</p>
          </div>
        </div>

        <Card
          className={`mt-18 w-full rounded-[2rem] border-[#efefef] bg-[#f7f7f7] px-8 py-10 shadow-none md:px-14 md:py-14 ${interactiveCardClassName}`}
        >
          <div className="mb-5 flex justify-start text-[#d4d4d4]">
            <Quote className="size-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#b9b9b9]" />
          </div>
          <p className="font-display text-3xl leading-[1.45] tracking-[0.01em] text-[#222222] md:text-5xl">
            排盘不是为了替你宣告命运，
            <br />
            而是帮助你更清楚地看见自己。
          </p>
          <p className="mt-6 text-xl text-[#8a8a8a]">知微 · AI 命理解读</p>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <div className="space-y-3 text-center">
          <h2 className="text-4xl font-semibold text-[#111111] md:text-5xl">
            核心理念
          </h2>
          <p className="text-lg text-[#8a8a8a]">用更现代的方式理解传统命理</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {philosophy.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className={`rounded-[1.8rem] border-[#f0f0f0] bg-white p-7 shadow-none ${interactiveCardClassName}`}
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-[#f5f5f5] text-[#111111] transition-colors duration-300 group-hover:bg-[#111111] group-hover:text-white">
                  <Icon className="size-6" />
                </div>
                <CardTitle className="mt-7 font-sans text-[2rem] leading-[1.35] tracking-[-0.02em] text-[#111111]">
                  {item.title}
                </CardTitle>
                <CardDescription className="mt-5 text-lg leading-10 text-[#707070]">
                  {item.body}
                </CardDescription>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <div className="space-y-3 text-center">
          <h2 className="text-4xl font-semibold text-[#111111] md:text-5xl">
            分析系统
          </h2>
          <p className="text-lg text-[#8a8a8a]">探索知微当前提供的核心能力</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {systems.map((item) => (
            <Card
              key={item.title}
              className={`rounded-[1.8rem] border-[#f0f0f0] bg-white p-8 shadow-none ${interactiveCardClassName}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-xl">
                  <CardTitle className="font-sans text-[2rem] leading-[1.3] tracking-[-0.02em] text-[#111111]">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mt-5 text-lg leading-10 text-[#707070]">
                    {item.body}
                  </CardDescription>
                </div>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-[#111111] transition-colors duration-300 group-hover:bg-[#111111] group-hover:text-white">
                  <Target className="size-5" />
                </div>
              </div>

              <Link
                href={item.href}
                className="mt-8 inline-flex items-center gap-2 text-lg font-medium text-[#111111] transition duration-300 group-hover:gap-3"
              >
                {item.cta}
                <ChevronRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-8 md:px-10">
        <div className="rounded-[2rem] bg-[#f7f7f7] px-8 py-12 text-center md:px-12 md:py-16">
          <h2 className="font-display text-4xl leading-[1.15] tracking-[0.01em] text-[#111111] md:text-6xl">
            从命盘开始，
            <br />
            理解你正在经历的人生结构。
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-[#7a7a7a]">
            不用先相信任何神秘叙事。先从一张结构化命盘开始，再决定哪些解释值得你继续阅读。
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
            <Link href="/divinations/new">
              <Button
                size="lg"
                className="h-14 min-w-56 rounded-2xl bg-[#111111] px-7 text-lg text-white hover:bg-[#111111]/95"
              >
                开始体验
              </Button>
            </Link>
            <Link href="/blog">
              <Button
                size="lg"
                variant="outline"
                className="h-14 min-w-56 rounded-2xl border-[#bfbfbf] bg-white px-7 text-lg text-[#111111] hover:bg-[#fafafa]"
              >
                查看样例
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
