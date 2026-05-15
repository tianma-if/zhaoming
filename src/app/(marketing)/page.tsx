import Link from "next/link";
import {
  Brain,
  ChevronRight,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const philosophy = [
  {
    title: "AI 语义建模",
    body:
      "告别晦涩的口诀，将复杂的干支宫位转化为多维的数据洞察。",
    icon: Brain,
  },
  {
    title: "客观逻辑叙事",
    body:
      "剥离主观臆断与玄学滤镜，用算力还原数理推演的本质。",
    icon: Lightbulb,
  },
  {
    title: "决策辅助主权",
    body:
      "每一个变量都清晰可见，把人生的解释权重新归还给你自己。",
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
          知微见著，重构传统命理的理性坐标。
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

      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-12 pt-4 md:px-10 md:pb-16 md:pt-8">
        <div className="space-y-3 text-center">
          <h2 className="text-4xl font-semibold text-[#111111] md:text-5xl">
            核心理念
          </h2>
          <p className="text-lg text-[#8a8a8a]">用更清晰的变量与逻辑，重新理解传统命理</p>
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
