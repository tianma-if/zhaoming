import type { BaziChart } from "@/types/divination";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { countBaziElements, getBaziDayMaster } from "@/lib/divination/bazi-verdict";
import { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { WuxingBadge } from "./wuxing-badge";
import { WuxingRadarChart } from "./wuxing-radar-chart";

const wuxingOrder = ["木", "火", "土", "金", "水"];
const hiddenStemWeights = ["藏干 100%", "藏干 70%", "藏干 50%"];
const generates: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};
const controls: Record<string, string> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};
const pillarStages: Record<string, string> = {
  year: "童年到青年",
  month: "成年基础运",
  day: "自身性格",
  time: "中年到晚年",
};
const shenShaStages: Record<string, string> = {
  year: "祖辈童年",
  month: "父母青年",
  day: "自身配偶",
  time: "子女晚年",
};
const tenGodNotes: Record<string, { meaning: string; feature: string }> = {
  比肩: {
    meaning: "代表同气、帮助，也暗示自我意识和合作关系。",
    feature: "合作能力强，重情义，也需要保持独立判断。",
  },
  劫财: {
    meaning: "代表竞争、冲突与主动争取资源的能力。",
    feature: "竞争意识强，有主见，资源边界需要清楚。",
  },
  食神: {
    meaning: "代表表达、才艺、享受和稳定输出。",
    feature: "表达自然，适合长期积累与温和创造。",
  },
  伤官: {
    meaning: "代表创新、变革、锋芒和不守旧。",
    feature: "创新能力强，反应快，但要避免过度对抗规则。",
  },
  正财: {
    meaning: "代表正财、正当事业、经营与现实成果。",
    feature: "理财能力强，重实际，适合稳定经营。",
  },
  偏财: {
    meaning: "代表流动资源、机会嗅觉与外部连接。",
    feature: "行动灵活，善抓机会，但要控制风险。",
  },
  正官: {
    meaning: "代表正统权威、秩序、地位与名誉。",
    feature: "重规矩，有责任感，适合承担明确职责。",
  },
  七杀: {
    meaning: "代表压力、挑战、决断和攻坚能力。",
    feature: "行动果断，抗压强，但要避免急躁冒进。",
  },
  正印: {
    meaning: "代表学习、文化修养、长辈与贵人扶持。",
    feature: "重学习，富同理心，容易获得稳定支持。",
  },
  偏印: {
    meaning: "代表非典型学习、洞察力和独立思考。",
    feature: "敏感、有悟性，适合研究复杂或冷门问题。",
  },
};
const shenShaNotes: Record<string, string> = {
  天德: "德性护持，遇事多有缓冲。",
  月德: "处世温厚，利人缘与贵人。",
  官日: "重秩序与职责，利规范事务。",
  六合: "关系协调，利合作与整合。",
  不将: "婚嫁与人际取象较平顺。",
  续世: "延续、承接与稳定性增强。",
  鸣吠对: "消息往来、人事响应较明显。",
  天吏: "事务压力与规训感增强。",
  致死: "凶煞取象，宜谨慎处理风险。",
  血支: "注意血光、磕碰或外伤取象。",
  土符: "土气阻滞，注意拖延与沉重感。",
  归忌: "归纳、收束之事需谨慎。",
  血忌: "不宜轻忽外伤、手术类象。",
  天刑: "刑罚、规则、压力类象明显。",
};

function getElementRelation(dayElement: string, element: string) {
  if (element === dayElement) {
    return "同我";
  }

  if (generates[element] === dayElement) {
    return "生我";
  }

  if (generates[dayElement] === element) {
    return "我生";
  }

  if (controls[element] === dayElement) {
    return "克我";
  }

  if (controls[dayElement] === element) {
    return "我克";
  }

  return "参考";
}

function getShenShaType(label: string) {
  if (label.includes("吉神")) {
    return "吉";
  }

  if (label.includes("凶") || label.includes("煞")) {
    return "煞";
  }

  if (label.includes("冲")) {
    return "冲";
  }

  return "神";
}

export function BaziInsights({ chart }: { chart: BaziChart }) {
  const elementCounts = countBaziElements(chart);
  const dayMaster = getBaziDayMaster(chart);
  const view = getBaziViewModel(chart);
  const visibleElementCounts = wuxingOrder.map((element) => ({
    element,
    count: view.pillars.reduce(
      (total, pillar) =>
        total + pillar.elements.filter((pillarElement) => pillarElement === element).length,
      0,
    ),
    relation: getElementRelation(dayMaster.element, element),
  }));
  const tenGodCounts = view.pillars
    .flatMap((pillar) => [
      pillar.shiShenGan,
      ...pillar.hiddenStemDetails.map((item) => item.shiShen),
    ])
    .filter((tenGod): tenGod is string => Boolean(tenGod))
    .reduce<Record<string, number>>((counts, tenGod) => {
      counts[tenGod] = (counts[tenGod] ?? 0) + 1;
      return counts;
    }, {});
  const tenGodSummary = Object.entries(tenGodCounts)
    .map(([tenGod, count]) => `${tenGod}(${count}次)`)
    .join(" ");
  const shenShaItems = view.shenSha.flatMap((group) =>
    group.values.map((item) => ({
      name: item,
      type: getShenShaType(group.label),
      note: shenShaNotes[item.replace(/（.*$/, "")] ?? "用于补充取象与事件倾向。",
    })),
  );
  const shenShaColumns = view.pillars.map((pillar, pillarIndex) => ({
    key: pillar.key,
    label: pillar.label,
    stage: shenShaStages[pillar.key],
    items: shenShaItems.filter((_, itemIndex) => itemIndex % view.pillars.length === pillarIndex),
  }));

  return (
    <div className="space-y-6">
      <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[0.04em]">五行分析</CardTitle>
          <CardDescription className="text-sm leading-7">五行分布与关系</CardDescription>
        </div>
        <Separator />
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.1rem] border border-border bg-muted/35 p-4">
            <div className="flex items-end gap-3">
              <span className="font-display text-4xl">{dayMaster.stem}</span>
              <span className="pb-1 text-sm text-muted-foreground">日主</span>
              <WuxingBadge element={dayMaster.element} />
            </div>
            <Badge>五行分布与关系</Badge>
          </div>

          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,10rem),1fr))]">
            {visibleElementCounts.map((item) => (
              <div key={item.element} className="space-y-2 rounded-[1.1rem] bg-muted/35 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-3xl">{item.element}</p>
                  <Badge className="bg-white">{item.relation}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.count} 个</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-[1.1rem] bg-muted/20 p-4">
            <p className="font-medium">五行五芒星分布：</p>
            <p className="text-sm text-muted-foreground">
              数量分布仅供参考，需结合日主关系来理解。
            </p>
            <WuxingRadarChart data={elementCounts} />
          </div>
        </div>
      </Card>

      <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[0.04em]">十神分析</CardTitle>
          <CardDescription className="text-sm leading-7">
            八字中的主要十神关系
          </CardDescription>
        </div>
        <Separator />
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[64rem] grid-cols-4 gap-6">
            {view.pillars.map((pillar) => {
              const entries = [
                {
                  key: `${pillar.key}-gan`,
                  name: pillar.shiShenGan,
                  source: "天干",
                  weight: "",
                },
                ...pillar.hiddenStemDetails.map((item, index) => ({
                  key: `${pillar.key}-${item.stem}-${item.shiShen}`,
                  name: item.shiShen,
                  source: "藏干",
                  weight: hiddenStemWeights[index] ?? "藏干",
                })),
              ].filter((item): item is typeof item & { name: string } => Boolean(item.name));

              return (
                <section key={pillar.key} className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold tracking-[0.04em]">{pillar.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      （{pillarStages[pillar.key]}）
                    </p>
                  </div>
                  <div className="space-y-4">
                    {entries.map((entry) => {
                      const note = tenGodNotes[entry.name];
                      const isHiddenStem = entry.source === "藏干";

                      return (
                        <article
                          key={entry.key}
                          className={[
                            "flex min-h-[13.75rem] flex-col rounded-xl p-4",
                            isHiddenStem
                              ? "bg-muted/15"
                              : "border border-border bg-muted/45 shadow-[0_1px_2px_rgba(22,20,17,0.06)]",
                          ].join(" ")}
                        >
                          <div className="grid min-h-8 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                            <div className="flex min-w-0 items-baseline gap-1.5">
                              <p className="whitespace-nowrap text-xl font-semibold leading-8">
                                {entry.name}
                              </p>
                              {isHiddenStem ? (
                                <span className="whitespace-nowrap text-sm text-muted-foreground">
                                  （藏干）
                                </span>
                              ) : null}
                            </div>
                            {entry.weight ? (
                              <span className="whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-sm">
                                {entry.weight}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-4 text-base leading-7 text-muted-foreground">
                            {note?.meaning ?? "用于观察此处与日主之间的关系。"}
                          </p>
                          <p className="mt-3 text-sm font-semibold leading-6">
                            表现特征：{note?.feature ?? "需要结合全局五行强弱判断。"}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
        <div className="space-y-2 rounded-[1.1rem] bg-muted/25 p-4 text-sm">
          <p className="font-medium">总体特征分析：</p>
          <p className="text-muted-foreground">
            日主所见十神分布：{tenGodSummary}。此分析显示八字中十神的分布情况。
          </p>
          <p className="text-muted-foreground">
            这些十神特质会在不同人生阶段显现：年柱主管童年到青年，月柱主管成年基础运，日柱代表自身性格，时柱主管中年到晚年。
          </p>
        </div>
      </Card>

      <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white shadow-none">
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[0.04em]">神煞分析</CardTitle>
          <CardDescription className="text-sm leading-7">
            神煞仅作辅助参考，不宜单独论吉凶。
          </CardDescription>
        </div>
        <Separator />
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <p className="font-medium">神煞分布与影响</p>
            <span className="inline-flex size-5 items-center justify-center rounded-full border border-foreground text-xs font-semibold">
              i
            </span>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[64rem] grid-cols-4 gap-5">
              {shenShaColumns.map((column) => (
                <section key={column.key} className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold tracking-[0.04em]">{column.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{column.stage}</p>
                  </div>
                  <div className="space-y-2.5">
                    {column.items.map((item) => (
                      <article
                        key={`${column.key}-${item.name}`}
                        className="grid min-h-[4.75rem] grid-cols-[minmax(0,1fr)_2.25rem] gap-3 rounded-lg border border-border bg-white px-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-lg font-semibold leading-6">{item.name}</p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {item.note}
                          </p>
                        </div>
                        <span className="inline-flex size-8 items-center justify-center rounded-md bg-foreground text-sm font-semibold text-background">
                          {item.type}
                        </span>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
