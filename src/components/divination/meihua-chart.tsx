import type { MeihuaChart } from "@/types/divination";
import { LiuyaoYaoGlyph } from "@/components/divination/liuyao-yao-glyph";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const lineLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;

function formatMethod(method: MeihuaChart["meta"]["method"]) {
  return method === "time" ? "时间起卦" : "数字起卦";
}

function getLineBooleans(key: string) {
  const upperCode = key.slice(0, 3);
  const lowerCode = key.slice(3, 6);

  return [...lowerCode, ...upperCode].map((value) => value === "1");
}

function HexagramPanel({
  title,
  name,
  subtitle,
  keyCode,
  movingLine,
}: {
  title: string;
  name: string;
  subtitle: string;
  keyCode: string;
  movingLine?: number;
}) {
  const rows = getLineBooleans(keyCode)
    .map((isYang, index) => ({
      isYang,
      index: index + 1,
      label: lineLabels[index]!,
    }))
    .reverse();

  return (
    <section className="space-y-4 rounded-md border border-black/10 bg-white p-5">
      <div className="space-y-1 text-center">
        <Badge variant="outline" className="rounded-full">
          {title}
        </Badge>
        <h3 className="text-2xl font-semibold text-black">{name}</h3>
        <p className="text-sm text-black/55">{subtitle}</p>
      </div>

      <div className="space-y-3 rounded-md border border-black/8 bg-[#f7f7f5] px-5 py-4">
        {rows.map((line) => (
          <div
            key={`${title}-${line.index}`}
            className="grid grid-cols-[3.2rem_minmax(0,1fr)_2.5rem] items-center gap-3"
          >
            <span className="text-right text-xs text-black/55">{line.label}</span>
            <LiuyaoYaoGlyph isYang={line.isYang} className="max-w-[11rem]" />
            <span className="text-xs font-medium text-black/45">
              {movingLine === line.index ? "动" : ""}
            </span>
          </div>
        ))}
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

export function MeihuaChartView({ chart }: { chart: MeihuaChart }) {
  return (
    <div className="space-y-6">
      <Card className="rounded-xl border border-black/10 bg-white p-6 shadow-none md:p-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <CardTitle className="text-4xl tracking-tight text-black">梅花易数起卦结果</CardTitle>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-base leading-7">
              <MetaLine label="起卦时间" value={chart.meta.divinationDateTime} />
              <MetaLine label="起卦方式" value={formatMethod(chart.meta.method)} />
              <MetaLine label="干支" value={chart.meta.ganZhi} />
            </div>
          </div>

          <div className="rounded-md border border-black/8 bg-[#f7f7f6] px-5 py-5">
            <p className="text-lg font-semibold text-black">所问之事</p>
            <p className="mt-3 text-base leading-8 text-black/70">{chart.meta.question}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <HexagramPanel
              title="本卦"
              name={chart.originalHexagram.name}
              subtitle={`${chart.originalHexagram.upperTrigram}上${chart.originalHexagram.lowerTrigram}下`}
              keyCode={chart.originalHexagram.key}
              movingLine={chart.movingLine}
            />
            <HexagramPanel
              title="互卦"
              name={chart.mutualHexagram.name}
              subtitle={`${chart.mutualHexagram.upperTrigram}上${chart.mutualHexagram.lowerTrigram}下`}
              keyCode={chart.mutualHexagram.key}
            />
            <HexagramPanel
              title="变卦"
              name={chart.changedHexagram.name}
              subtitle={`${chart.changedHexagram.upperTrigram}上${chart.changedHexagram.lowerTrigram}下`}
              keyCode={chart.changedHexagram.key}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="space-y-4 rounded-md border border-black/10 bg-white p-5">
              <h3 className="text-xl font-semibold text-black">体用关系</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-[#f7f7f6] p-4">
                  <p className="text-xs text-black/50">体卦</p>
                  <p className="mt-1 text-2xl font-semibold">{chart.trigrams.body.name}</p>
                  <p className="text-sm text-black/60">
                    {chart.trigrams.body.nature} / {chart.trigrams.body.element}
                  </p>
                </div>
                <div className="rounded-md bg-[#f7f7f6] p-4">
                  <p className="text-xs text-black/50">用卦</p>
                  <p className="mt-1 text-2xl font-semibold">{chart.trigrams.use.name}</p>
                  <p className="text-sm text-black/60">
                    {chart.trigrams.use.nature} / {chart.trigrams.use.element}
                  </p>
                </div>
              </div>
              <Badge className="rounded-full px-3 py-1">{chart.relation.label}</Badge>
              <p className="text-sm leading-7 text-black/68">{chart.relation.summary}</p>
            </section>

            <section className="space-y-4 rounded-md border border-black/10 bg-white p-5">
              <h3 className="text-xl font-semibold text-black">起卦数字</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-[#f7f7f6] p-4">
                  <p className="text-xs text-black/50">上卦数</p>
                  <p className="mt-1 text-2xl font-semibold">{chart.numbers.upper}</p>
                </div>
                <div className="rounded-md bg-[#f7f7f6] p-4">
                  <p className="text-xs text-black/50">下卦数</p>
                  <p className="mt-1 text-2xl font-semibold">{chart.numbers.lower}</p>
                </div>
                <div className="rounded-md bg-[#f7f7f6] p-4">
                  <p className="text-xs text-black/50">动爻</p>
                  <p className="mt-1 text-2xl font-semibold">第 {chart.movingLine} 爻</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-black/60">{chart.numbers.source}</p>
            </section>
          </div>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold text-black">结构提示</h3>
            <div className="space-y-3 text-base leading-8 text-black/72">
              {chart.guidance.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>

          {chart.meta.notes ? (
            <div className="space-y-4 border-t border-black/8 pt-6">
              <h3 className="text-2xl font-semibold text-black">补充背景</h3>
              <CardDescription className="text-base leading-8 text-black/68">
                {chart.meta.notes}
              </CardDescription>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
