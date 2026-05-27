import Link from "next/link";
import {
  Brain,
  ChevronRight,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { GoogleOneTapPrompt } from "@/components/auth/google-one-tap-prompt";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/env";

type SystemItem = {
  title: string;
  alias?: string;
  body: string;
  href?: string;
};

type SystemGroup = {
  category: string;
  items: SystemItem[];
};

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

const systemGroups: SystemGroup[] = [
  {
    category: "命理类",
    items: [
      {
        title: "八字算命",
        alias: "四柱推命",
        body: "以出生年、月、日、时建立四柱结构，分析五行流转、格局重心与人生阶段线索。",
        href: "/divinations/new",
      },
      {
        title: "紫微斗数",
        body: "围绕十二宫位与主星分布，呈现更适合现代阅读的个人命盘结构。",
        href: "/divinations/ziwei",
      },
      {
        title: "袁天罡称骨算命",
        body: "从更简化的传统规则切入，适合作为轻量级命理体验入口。",
        href: "/divinations/chenggu",
      },
    ],
  },
  {
    category: "占卜类",
    items: [
      {
        title: "六爻占卜",
        alias: "纳甲筮法",
        body: "适合面向具体问题推演变化路径，用更结构化的方式整理卦象信息。",
        href: "/divinations/liuyao",
      },
      {
        title: "梅花易数",
        body: "偏向即时起念与场景判断，适合作为日常问题的快速观察工具。",
        href: "/divinations/meihua",
      },
      {
        title: "三式",
        alias: "奇门遁甲、太乙神数、大六壬",
        href: "/divinations/sanshi",
        body: "更高阶的数术体系，适合后续扩展为进阶决策与时空判断模块。",
      },
    ],
  },
  {
    category: "相术类",
    items: [
      {
        title: "面相学",
        body: "从五官、骨相与气质信息入手，提供偏观察型的人格与运势参考。",
      },
      {
        title: "手相学",
        body: "围绕掌纹、手型与线条特征，补充另一种更直观的个体解读方式。",
      },
    ],
  },
];

export default async function HomePage() {
  const session = await getAuthSession();
  const user = session?.user ?? null;
  const googleClientId = getEnv().GOOGLE_CLIENT_ID ?? null;
  const interactiveCardClassName =
    "group transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#111111] hover:shadow-[0_24px_44px_-30px_rgba(17,17,17,0.28)]";

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <GoogleOneTapPrompt
        callbackURL="/divinations"
        clientId={googleClientId}
        enabled={!user}
      />

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 pt-10 text-center md:px-10 md:pb-24 md:pt-20">
        <h1 className="font-display text-[4.3rem] leading-[0.95] tracking-[0.01em] text-foreground md:text-[6.6rem]">
          照命
        </h1>
        <p className="mt-5 text-2xl text-[#7d7d7d] md:text-[2rem]">
          AI 解构命运的底层代码
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
            <Link href="/divinations/ziwei">
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
          <p className="text-lg text-[#8a8a8a]">以命理、占卜、相术三条主线组织你的产品能力地图</p>
        </div>

        <div className="mt-14 space-y-12">
          {systemGroups.map((group) => (
            <div key={group.category} className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="h-px flex-1 bg-[#ececec]" />
                <h3 className="shrink-0 text-2xl font-semibold tracking-[0.06em] text-[#111111]">
                  {group.category}
                </h3>
                <div className="h-px flex-1 bg-[#ececec]" />
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <Card
                    key={item.title}
                    className={`rounded-[1.8rem] border-[#f0f0f0] bg-white p-8 shadow-none ${interactiveCardClassName}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="max-w-xl">
                        <div className="flex size-12 items-center justify-center rounded-full bg-[#f5f5f5] text-[#111111] transition-colors duration-300 group-hover:bg-[#111111] group-hover:text-white">
                          <Target className="size-5" />
                        </div>
                        <CardTitle className="mt-6 font-sans text-[1.9rem] leading-[1.3] tracking-[-0.02em] text-[#111111]">
                          {item.title}
                        </CardTitle>
                        {item.alias ? (
                          <p className="mt-2 text-sm tracking-[0.08em] text-[#8a8a8a]">
                            {item.alias}
                          </p>
                        ) : null}
                        <CardDescription className="mt-5 text-lg leading-10 text-[#707070]">
                          {item.body}
                        </CardDescription>
                      </div>
                    </div>

                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mt-8 inline-flex items-center gap-2 text-lg font-medium text-[#111111] transition duration-300 group-hover:gap-3"
                      >
                        立即体验
                        <ChevronRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <div className="mt-8 inline-flex items-center gap-2 text-lg font-medium text-[#111111] transition duration-300 group-hover:gap-3">
                        敬请期待
                        <ChevronRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
