import { ArrowRight } from "lucide-react";
import type { LiuyaoChart, LiuyaoLine } from "@/types/divination";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

function formatMethod(method: LiuyaoChart["meta"]["method"]) {
  return method === "coins" ? "铜钱摇卦" : "手动录入";
}

function getMovingLineText(chart: LiuyaoChart) {
  return chart.movingLineIndexes.length
    ? chart.movingLineIndexes.map((index) => chart.lines[index - 1]?.label).join("、")
    : "无动爻";
}

function YaoStroke({
  isYang,
  accent = false,
}: {
  isYang: boolean;
  accent?: boolean;
}) {
  const fillClassName = accent ? "bg-black" : "bg-black";

  if (isYang) {
    return (
      <div
        className={`h-[3px] w-full rounded-full ${fillClassName}`}
      />
    );
  }

  return (
    <div className="grid grid-cols-[1fr_0.42fr_1fr] items-center gap-2">
      <div className={`h-[3px] rounded-full ${fillClassName}`} />
      <div className="h-px rounded-full bg-black/35" />
      <div className={`h-[3px] rounded-full ${fillClassName}`} />
    </div>
  );
}

function HexagramColumn({
  title,
  subtitle,
  lines,
  variant,
}: {
  title: string;
  subtitle: string;
  lines: LiuyaoLine[];
  variant: "original" | "changed";
}) {
  const linesTopDown = lines.slice().reverse();

  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-black/12 bg-white p-5">
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-[11px] tracking-[0.28em] text-black/45 uppercase">{title}</p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-[2.4rem] leading-none tracking-[0.04em] text-foreground">
                {subtitle}
              </h3>
              <p className="mt-2 text-sm text-black/55">
                {variant === "original" ? "此刻局势的落点" : "变化之后的走向"}
              </p>
            </div>
            <div className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/50">
              {variant === "original" ? "本位" : "后势"}
            </div>
          </div>
        </div>

        <div className="rounded-[1rem] border border-black/10 p-4">
          <div className="space-y-4">
            {linesTopDown.map((line) => {
              const showYang = variant === "original" ? line.yinYang === "yang" : line.changedSymbol === "────────";

              return (
                <div
                  key={`${variant}-${line.index}`}
                  className={`grid grid-cols-[3.5rem_minmax(0,1fr)_3rem] items-center gap-3 rounded-xl px-2 py-1.5 ${
                    line.isMoving && variant === "original"
                      ? "bg-black text-white"
                      : "bg-transparent"
                  }`}
                >
                  <div className={`text-[11px] tracking-[0.18em] ${line.isMoving && variant === "original" ? "text-white/75" : "text-black/45"}`}>
                    {line.label}
                  </div>
                  <YaoStroke isYang={showYang} accent={line.isMoving && variant === "original"} />
                  <div className={`text-right text-xs ${line.isMoving && variant === "original" ? "text-white/80" : "text-black/50"}`}>
                    {variant === "original" ? line.value : line.isMoving ? "变" : "静"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

function HexagramMeta({
  label,
  trigramText,
  description,
}: {
  label: string;
  trigramText: string;
  description: string;
}) {
  return (
    <div className="rounded-[1rem] border border-black/10 bg-white p-4">
      <p className="text-[11px] tracking-[0.24em] text-black/45 uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl tracking-[0.04em] text-foreground">{trigramText}</p>
      <p className="mt-2 text-sm leading-7 text-black/65">{description}</p>
    </div>
  );
}

export function LiuyaoChartView({ chart }: { chart: LiuyaoChart }) {
  const movingLineText = getMovingLineText(chart);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[1.5rem] border border-black/12 bg-white p-0 shadow-none">
        <section className="px-6 py-7 md:px-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="rounded-full border-black/10 bg-white px-3 py-1 text-black/60">
                    六爻卦象
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-black/10 bg-white px-3 py-1 text-black/60">
                    {formatMethod(chart.meta.method)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <CardTitle className="font-display text-5xl tracking-[0.05em] md:text-6xl">
                    {chart.originalHexagram.name}
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-8 text-black/68">
                    {chart.originalHexagram.description}
                  </CardDescription>
                </div>
              </div>

              <div className="rounded-[1rem] border border-black/10 px-4 py-3">
                <p className="text-[11px] tracking-[0.24em] text-black/45 uppercase">变化焦点</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{movingLineText}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <HexagramMeta
                label="起卦时间"
                trigramText={chart.meta.divinationDateTime.slice(5, 16)}
                description={`完整时间：${chart.meta.divinationDateTime}`}
              />
              <HexagramMeta
                label="本卦结构"
                trigramText={`${chart.originalHexagram.upperTrigram}上${chart.originalHexagram.lowerTrigram}下`}
                description="更接近事情此刻的整体格局、力量分布和你所处的位置。"
              />
              <HexagramMeta
                label="变卦结构"
                trigramText={`${chart.changedHexagram.upperTrigram}上${chart.changedHexagram.lowerTrigram}下`}
                description="更接近变化继续推进后，局势会朝什么方向显现。"
              />
              <HexagramMeta
                label="干支与农历"
                trigramText={chart.meta.lunar}
                description={chart.meta.ganZhi}
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-black/10" />

        <section className="px-6 py-7 md:px-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] xl:items-center">
            <HexagramColumn
              title="原始卦盘"
              subtitle={chart.originalHexagram.name}
              lines={chart.lines}
              variant="original"
            />

            <div className="hidden xl:flex xl:justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-white">
                <ArrowRight className="size-6 text-black/55" />
              </div>
            </div>

            <HexagramColumn
              title="变化后"
              subtitle={chart.changedHexagram.name}
              lines={chart.lines}
              variant="changed"
            />
          </div>
        </section>
      </Card>

      <Card className="overflow-hidden rounded-[1.25rem] border border-black/12 bg-white p-0 shadow-none">
        <div className="grid gap-6 px-6 py-6 md:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-3">
            <CardTitle className="text-3xl tracking-[0.04em]">卦象阅读提示</CardTitle>
            <CardDescription className="text-base leading-8 text-black/68">
              当前版本更强调六爻的阅读体验和变化感知，会围绕本卦、动爻与变卦来帮助你理解问题走势；完整纳甲、六亲、六神等专业层后续再继续补充。
            </CardDescription>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-black/10 bg-white p-4">
              <p className="text-sm font-medium text-foreground">如何看这张卦盘</p>
              <p className="mt-2 text-sm leading-7 text-black/65">
                先看本卦判断现状，再看动爻寻找关键转折，最后用变卦理解后续可能显现的方向。
              </p>
            </div>

            {chart.meta.notes ? (
              <div className="rounded-[1rem] border border-black/10 bg-white p-4">
                <p className="text-sm font-medium text-foreground">补充背景</p>
                <p className="mt-2 text-sm leading-7 text-black/65">{chart.meta.notes}</p>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
