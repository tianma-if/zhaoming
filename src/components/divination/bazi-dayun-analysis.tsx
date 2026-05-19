import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;

const daYunFeatures: Record<string, string> = {
  比肩: "合作共事期，团队发展佳",
  劫财: "竞争激烈期，需沉着应对",
  食神: "才智显露期，人际关系好",
  伤官: "变革创新期，注意度量把握",
  正财: "财运亨通期，适合稳健发展",
  偏财: "偏财运旺期，投资机会多",
  正官: "仕途发展期，需谨慎行事",
  七杀: "创业进取期，注意把握机会",
  正印: "学习成长期，利于深造",
  偏印: "艺术发展期，创造力强",
};

export function BaziDaYunAnalysis({ daYun }: { daYun: NonNullable<BaziViewModel["daYun"]> }) {
  return (
    <Card className="space-y-6 rounded-[1.6rem] border border-border bg-white shadow-none">
      <div className="space-y-2">
        <CardTitle className="text-3xl tracking-[0.04em]">大运详情（十年运势）</CardTitle>
        <CardDescription className="text-sm leading-7">
          分析十年运势周期的人生阶段变化
        </CardDescription>
      </div>
      <Separator />
      <div className="space-y-6">
        <div className="grid gap-4 rounded-xl border border-border bg-muted/20 p-5 min-[760px]:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">起运时间</p>
            <p className="text-2xl font-semibold">{daYun.startLabel}</p>
            <p className="text-muted-foreground">{daYun.startSolar}</p>
          </div>
          {daYun.current ? (
            <div className="rounded-lg border border-border bg-muted/45 p-4">
              <p className="text-sm text-muted-foreground">当前大运</p>
              <p className="mt-1 text-2xl font-semibold">
                年龄范围： {daYun.current.ageRange}
              </p>
              <p className="mt-1 text-muted-foreground">
                {daYun.current.tenGod} · {daYun.current.ganZhi}
              </p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
          {daYun.periods.map((period) => {
            const isChildStage = period.index === 0;

            return (
              <article
                key={`${period.index}-${period.ganZhi || "child"}`}
                className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-[0_1px_2px_rgba(22,20,17,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isChildStage ? "童年阶段" : `第${period.index}运 · ${period.startYear}年`}
                    </p>
                    <p className="mt-3 text-2xl font-semibold">
                      年龄范围： {period.ageRange}
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      {isChildStage ? "小运阶段" : period.tenGod}
                    </p>
                  </div>
                  {period.ganZhi ? (
                    <p className="whitespace-nowrap text-xl font-semibold">{period.ganZhi}</p>
                  ) : (
                    <p className="whitespace-nowrap text-xl font-semibold">父母庇护期</p>
                  )}
                </div>
                <Separator />
                <div className="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-1 text-sm">
                  <p className="text-muted-foreground">五行</p>
                  <p className="text-muted-foreground">特征</p>
                  <p className="text-muted-foreground">天干</p>
                  <p>
                    <span className="mr-4 font-semibold">{period.stemElement || "-"}</span>
                    {isChildStage
                      ? "依靠父母庇护"
                      : daYunFeatures[period.tenGod] ?? "阶段特征需结合全盘判断"}
                  </p>
                  <p className="text-muted-foreground">地支</p>
                  <p>
                    <span className="mr-4 font-semibold">{period.branchElement || "-"}</span>
                    {isChildStage ? "学习成长为主" : ""}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="space-y-3 rounded-xl bg-muted/20 p-5 text-sm leading-7">
          <p className="text-lg font-semibold">大运运势提示：</p>
          <p className="text-muted-foreground">
            大运是十年为期的重要运势周期，对人生发展有重大影响。
          </p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>大运具有持续性影响，决定长期人生走向</li>
            <li>不同大运的五行特性需要不同应对策略</li>
            {daYun.current ? (
              <li>
                当前大运（年龄范围：{daYun.current.ageRange}）是
                {daYun.current.tenGod}阶段，适合结合现实目标调整节奏
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </Card>
  );
}
