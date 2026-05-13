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

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-18 px-6 pb-24 pt-16 text-center md:px-10 md:pt-24">
        <div className="space-y-6">
          <Badge>AI DIVINATION</Badge>
          <div className="space-y-4">
            <h1 className="font-display text-6xl leading-none tracking-[0.04em] md:text-8xl">
              知微
            </h1>
            <p className="text-lg leading-8 text-muted-foreground md:text-2xl">
              人工智能驱动的东方命理解析系统
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Link href="/divinations/new">
            <Button size="lg" className="min-w-48">
              八字测算
            </Button>
          </Link>
          <Link href="/blog">
            <Button size="lg" variant="outline" className="min-w-48">
              阅读样例
            </Button>
          </Link>
        </div>

        <Card className="w-full max-w-3xl rounded-[1.75rem] border border-border bg-white px-8 py-10 text-center shadow-[0_18px_36px_-32px_rgba(22,20,17,0.12)]">
          <p className="font-display text-3xl leading-[1.55] tracking-[0.04em] md:text-5xl">
            排盘的意义，
            <br />
            不是替你宣告命运，
            <br />
            而是帮助你理解结构。
          </p>
          <p className="mt-5 text-sm tracking-[0.28em] text-muted-foreground">
            ZHI WEI / STRUCTURE BEFORE INTERPRETATION
          </p>
        </Card>

        <section className="w-full space-y-8">
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
                className="space-y-4 rounded-[1.4rem] border border-border bg-white p-6 text-left shadow-[0_14px_28px_-28px_rgba(22,20,17,0.12)]"
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
