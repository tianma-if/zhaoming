import type { getBaziViewModel } from "@/lib/divination/renderers/bazi-view-model";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type BaziViewModel = ReturnType<typeof getBaziViewModel>;

export function BaziDaYunAnalysis({ daYun }: { daYun: NonNullable<BaziViewModel["daYun"]> }) {
  return (
    <Card className="space-y-4 rounded-[1.6rem] border border-border bg-white">
      <div className="space-y-1.5">
        <CardTitle className="text-2xl tracking-[0.04em]">大运详情（十年运势）</CardTitle>
        <CardDescription className="text-xs leading-5">
          分析十年运势周期的人生阶段变化
        </CardDescription>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="grid gap-3 rounded-xl border border-border bg-muted/20 p-4 min-[760px]:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">起运时间</p>
            <p className="text-xl font-semibold leading-tight">{daYun.startLabel}</p>
            <p className="text-sm text-muted-foreground">{daYun.startSolar}</p>
          </div>

          {daYun.current ? (
            <div className="rounded-lg border border-border bg-muted/45 p-3">
              <p className="text-xs text-muted-foreground">当前大运</p>
              <p className="mt-1 text-xl font-semibold">年龄范围：{daYun.current.ageRange}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {daYun.current.tenGod} / {daYun.current.ganZhi}
              </p>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {daYun.periods.map((period) => {
            const isChildStage = period.index === 0;

            return (
              <article
                key={`${period.index}-${period.ganZhi || "child"}`}
                className="space-y-2 rounded-xl border border-border bg-white px-3 py-3 shadow-[0_1px_2px_rgba(22,20,17,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {isChildStage ? "童年阶段" : `第${period.index}运 · ${period.startYear}年`}
                    </p>
                    <p className="mt-1.5 text-lg font-semibold">年龄范围：{period.ageRange}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {isChildStage ? "小运阶段" : period.tenGod}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-base font-semibold">
                    {period.ganZhi || "父母庇护期"}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-[4rem_1fr] gap-x-3 gap-y-1 text-xs">
                  <p className="text-muted-foreground">项目</p>
                  <p className="text-muted-foreground">结果</p>

                  <p className="text-muted-foreground">十神</p>
                  <p>{period.tenGod || "-"}</p>

                  <p className="text-muted-foreground">天干</p>
                  <p>
                    <span className="mr-3 font-semibold">
                      {period.ganZhi ? period.ganZhi.slice(0, 1) : "-"}
                    </span>
                    {period.stemElement || "-"}
                  </p>

                  <p className="text-muted-foreground">地支</p>
                  <p>
                    <span className="mr-3 font-semibold">
                      {period.ganZhi ? period.ganZhi.slice(1, 2) : "-"}
                    </span>
                    {period.branchElement || "-"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {daYun.current ? (
          <div className="space-y-1.5 rounded-xl bg-muted/20 p-3 text-xs leading-5">
            <p className="font-medium">当前大运摘要：</p>
            <p className="text-muted-foreground">
              {daYun.current.ageRange} / {daYun.current.ganZhi} / {daYun.current.tenGod}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
