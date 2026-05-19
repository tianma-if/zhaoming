import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;

const hiddenStemWeights = ["藏干 100%", "藏干 70%", "藏干 50%"];
const pillarStages: Record<string, string> = {
  year: "童年到青年",
  month: "成年基础运",
  day: "自身性格",
  time: "中年到晚年",
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

export function BaziTenGodAnalysis({ view }: { view: BaziViewModel }) {
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

  return (
    <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white shadow-none">
      <div className="space-y-2">
        <CardTitle className="text-3xl tracking-[0.04em]">十神分析</CardTitle>
        <CardDescription className="text-sm leading-7">八字中的主要十神关系</CardDescription>
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
  );
}
