import type { LiuyaoChart, LiuyaoLine } from "@/types/divination";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

function formatMethod(method: LiuyaoChart["meta"]["method"]) {
  return method === "coins" ? "随机数起卦" : "手动录入";
}

function getMovingLines(chart: LiuyaoChart) {
  return chart.lines.filter((line) => line.isMoving);
}

function getChangedLineValue(line: LiuyaoLine) {
  if (line.value === 6) return 7;
  if (line.value === 9) return 8;
  return line.value;
}

function YaoStroke({ isYang }: { isYang: boolean }) {
  if (isYang) {
    return <div className="h-[3px] w-full rounded-full bg-black" />;
  }

  return (
    <div className="grid grid-cols-[1fr_0.46fr_1fr] items-center gap-2">
      <div className="h-[3px] rounded-full bg-black" />
      <div className="h-px rounded-full bg-black/35" />
      <div className="h-[3px] rounded-full bg-black" />
    </div>
  );
}

function HexagramRows({
  lines,
  changed = false,
}: {
  lines: LiuyaoLine[];
  changed?: boolean;
}) {
  const rows = lines
    .map((line) => ({
      ...line,
      displayValue: changed ? getChangedLineValue(line) : line.value,
      isYang: changed ? line.value === 6 || line.value === 7 : line.yinYang === "yang",
    }))
    .slice()
    .reverse();

  return (
    <div className="rounded-[1.15rem] border border-black/8 bg-[#f5f5f3] px-6 py-5">
      <div className="space-y-4">
        {rows.map((line) => (
          <div
            key={`${changed ? "changed" : "original"}-${line.index}`}
            className="grid grid-cols-[4.2rem_minmax(0,1fr)_3.2rem] items-center gap-4"
          >
            <div className="text-right text-sm text-black/62">{line.label}</div>
            <div className={line.isMoving && !changed ? "rounded-lg bg-white px-3 py-2" : "px-3 py-2"}>
              <YaoStroke isYang={line.isYang} />
            </div>
            <div className="text-xs text-black/45">{changed ? (line.isMoving ? "变" : "") : line.isMoving ? "动" : ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HexagramPanel({
  badge,
  name,
  subtitle,
  lines,
  changed = false,
}: {
  badge: string;
  name: string;
  subtitle: string;
  lines: LiuyaoLine[];
  changed?: boolean;
}) {
  return (
    <section className="space-y-5">
      <div className="flex justify-center">
        <div className={`rounded-full px-6 py-2 text-lg font-semibold ${changed ? "bg-black/45 text-white" : "bg-black text-white"}`}>
          {badge}
        </div>
      </div>

      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-[2rem] font-semibold tracking-tight text-black">{name}</h3>
        </div>
        <p className="text-base text-black/55">{subtitle}</p>
      </div>

      <div className="mx-auto max-w-[23rem]">
        <HexagramRows lines={lines} changed={changed} />
      </div>
    </section>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-black/62">
      {label}：<span className="text-black/88">{value}</span>
    </span>
  );
}

export function LiuyaoChartView({ chart }: { chart: LiuyaoChart }) {
  const movingLines = getMovingLines(chart);

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-none md:p-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <CardTitle className="text-4xl tracking-tight text-black">卦象分析结果</CardTitle>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-lg leading-8">
              <MetaLine label="占卜日期和时间" value={chart.meta.divinationDateTime} />
              <MetaLine label="起卦方式" value={formatMethod(chart.meta.method)} />
              <MetaLine label="干支" value={chart.meta.ganZhi} />
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-black/8 bg-[#f7f7f6] px-6 py-7">
            <p className="text-2xl font-semibold text-black">您的问题：</p>
            <p className="mt-5 text-xl leading-9 text-black/70">{chart.meta.question}</p>
          </div>

          <div className="grid gap-10 xl:grid-cols-2 xl:gap-16">
            <HexagramPanel
              badge="本卦"
              name={chart.originalHexagram.name}
              subtitle={`${chart.originalHexagram.upperTrigram}上 ${chart.originalHexagram.lowerTrigram}下`}
              lines={chart.lines}
            />
            <HexagramPanel
              badge="变卦"
              name={chart.changedHexagram.name}
              subtitle={`${chart.changedHexagram.upperTrigram}上 ${chart.changedHexagram.lowerTrigram}下`}
              lines={chart.lines}
              changed
            />
          </div>

          <div className="rounded-[1.2rem] border border-black/8 bg-[#f7f7f6] px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-black">• 变爻位置</span>
              </div>

              {movingLines.length ? (
                <div className="flex flex-wrap gap-3">
                  {movingLines.map((line) => (
                    <Badge
                      key={line.index}
                      variant="outline"
                      className="rounded-full border-black/10 bg-white px-4 py-2 text-base text-black"
                    >
                      {line.label} 发生变化
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-black/60">本次起卦没有动爻，重点以本卦整体气象为主。</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-black">卦象说明</h3>
            <div className="space-y-5 text-lg leading-9 text-black/72">
              <p>
                本卦为 {chart.originalHexagram.name}，{chart.originalHexagram.description}
              </p>
              <p>
                变卦为 {chart.changedHexagram.name}，{chart.changedHexagram.description}
              </p>
              <p>
                当前系统已提供本卦、变卦与动爻位置的基础结构化结果；更完整的六亲、六神、世应等传统六爻字段后续再逐步补齐。
              </p>
            </div>
          </div>

          {chart.meta.notes ? (
            <div className="space-y-4 border-t border-black/8 pt-6">
              <h3 className="text-2xl font-semibold text-black">补充背景</h3>
              <CardDescription className="text-lg leading-9 text-black/68">
                {chart.meta.notes}
              </CardDescription>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
