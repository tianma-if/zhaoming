import type { BaziChart } from "@/types/divination";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WuxingBadge } from "./wuxing-badge";

const stemToElement: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const pillarMeaning: Record<string, string> = {
  year: "代表祖上、早期环境与外部印象。",
  month: "代表成长路径、事业基础与现实运作方式。",
  day: "代表自我核心、亲密关系与内在判断。",
  time: "代表后期倾向、子女缘与创造表达。",
};

function countElements(chart: BaziChart) {
  const counts: Record<string, number> = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
  };

  for (const pillar of chart.pillars) {
    for (const element of pillar.wuXing.split("")) {
      if (counts[element] !== undefined) {
        counts[element] += 1;
      }
    }

    for (const stem of pillar.hiddenStems) {
      const element = stemToElement[stem];
      if (element) {
        counts[element] += 1;
      }
    }
  }

  return Object.entries(counts)
    .map(([element, count]) => ({ element, count }))
    .sort((a, b) => b.count - a.count);
}

function getDayMaster(chart: BaziChart) {
  const dayStem = chart.pillars.find((pillar) => pillar.key === "day")?.heavenlyStem ?? "";
  const element = stemToElement[dayStem] ?? "未知";

  return {
    stem: dayStem,
    element,
  };
}

export function BaziInsights({ chart }: { chart: BaziChart }) {
  const elementCounts = countElements(chart);
  const strongest = elementCounts[0];
  const weakest = elementCounts[elementCounts.length - 1];
  const dayMaster = getDayMaster(chart);

  return (
    <div className="space-y-6">
      <Card className="section-surface space-y-5 rounded-[1.6rem] border border-border/80 shadow-none">
        <div className="space-y-2">
          <Badge>八字概要</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">先看日主与五行倾向</CardTitle>
          <CardDescription className="text-sm leading-7">
            八字阅读的起点通常不是直接下结论，而是先判断日主位置、五行分布和四柱各自承担的层次。
          </CardDescription>
        </div>
        <Separator />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">日主</p>
            <p className="font-display text-4xl">
              {dayMaster.stem}
              <span className="ml-2 text-2xl text-muted-foreground">{dayMaster.element}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              日柱天干是自我核心，决定观察整张命盘时的参照点。
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">较强五行</p>
            <div className="flex items-center gap-2">
              <WuxingBadge element={strongest.element} />
              <span className="text-sm">{strongest.count} 个信号位</span>
            </div>
            <p className="text-sm text-muted-foreground">
              这通常意味着相关性格和行为倾向更容易被放大。
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.28em] text-muted-foreground">较弱五行</p>
            <div className="flex items-center gap-2">
              <WuxingBadge element={weakest.element} />
              <span className="text-sm">{weakest.count} 个信号位</span>
            </div>
            <p className="text-sm text-muted-foreground">
              这类能力或议题往往更需要环境触发，或靠后天补足。
            </p>
          </div>
        </div>
      </Card>

      <Card className="section-surface space-y-5 rounded-[1.6rem] border border-border/80 shadow-none">
        <div className="space-y-2">
          <Badge>五行分布</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">命盘里的结构比例</CardTitle>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {elementCounts.map((item) => (
            <div
              key={item.element}
              className="space-y-3 rounded-[1rem] border border-border/70 bg-muted/50 p-4"
            >
              <WuxingBadge element={item.element} />
              <p className="font-display text-4xl">{item.count}</p>
              <p className="text-sm text-muted-foreground">结构信号</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="section-surface space-y-5 rounded-[1.6rem] border border-border/80 shadow-none">
        <div className="space-y-2">
          <Badge>四柱详解</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">每一柱分别在说什么</CardTitle>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {chart.pillars.map((pillar) => (
            <article
              key={pillar.key}
              className="space-y-4 rounded-[1rem] border border-border/70 bg-white/78 p-4"
            >
              <div className="space-y-1">
                <p className="text-xs tracking-[0.28em] text-muted-foreground">{pillar.label}</p>
                <p className="font-display text-4xl">
                  {pillar.heavenlyStem}
                  {pillar.earthlyBranch}
                </p>
                <p className="text-sm text-muted-foreground">{pillar.ganZhi}</p>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                {pillarMeaning[pillar.key]}
              </p>
              <div className="flex flex-wrap gap-2">
                {pillar.wuXing.split("").map((element, index) => (
                  <WuxingBadge key={`${pillar.key}-${element}-${index}`} element={element} />
                ))}
              </div>
              <Separator />
              <dl className="space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted-foreground">纳音</dt>
                  <dd>{pillar.naYin}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted-foreground">藏干</dt>
                  <dd>{pillar.hiddenStems.join(" / ")}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted-foreground">十神</dt>
                  <dd>{pillar.shiShenGan || "未提供"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
