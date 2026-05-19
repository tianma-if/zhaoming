import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;

const pillarStages: Record<string, string> = {
  year: "童年到青年",
  month: "成年基础运",
  day: "自身性格",
  time: "中年到晚年",
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
                stem: pillar.heavenlyStem,
              },
              ...pillar.hiddenStemDetails.map((item, index) => ({
                key: `${pillar.key}-${item.stem}-${item.shiShen}`,
                name: item.shiShen,
                source: "藏干",
                stem: item.stem,
                order: index + 1,
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
                            <span className="whitespace-nowrap text-sm text-muted-foreground">
                              （{entry.source}）
                            </span>
                          </div>
                          {entry.stem ? (
                            <span className="whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-sm">
                              {entry.stem}
                            </span>
                          ) : null}
                        </div>
                        <dl className="mt-4 grid gap-2 text-sm leading-6">
                          <div className="flex items-center justify-between gap-3">
                            <dt className="text-muted-foreground">来源</dt>
                            <dd className="font-medium">{entry.source}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <dt className="text-muted-foreground">天干</dt>
                            <dd className="font-medium">{entry.stem}</dd>
                          </div>
                          {isHiddenStem && "order" in entry ? (
                            <div className="flex items-center justify-between gap-3">
                              <dt className="text-muted-foreground">藏干序位</dt>
                              <dd className="font-medium">第 {entry.order} 位</dd>
                            </div>
                          ) : null}
                        </dl>
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
          日主所见十神分布：{tenGodSummary || "暂无十神数据"}。
        </p>
      </div>
    </Card>
  );
}
