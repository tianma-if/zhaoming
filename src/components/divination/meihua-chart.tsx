import type { MeihuaChart } from "@/types/divination";
import { LiuyaoYaoGlyph } from "@/components/divination/liuyao-yao-glyph";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription } from "@/components/ui/card";

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
            className="grid grid-cols-[3.2rem_minmax(0,13rem)_2.5rem] items-center justify-center gap-3"
          >
            <span className="text-right text-xs text-black/55">{line.label}</span>
            <LiuyaoYaoGlyph
              isYang={line.isYang}
              className="max-w-[13rem]"
              strokeClassName="h-2"
            />
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

function InfoItem({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-black/50">{label}</p>
      <p className="text-base font-semibold leading-5 text-black">{value}</p>
      {detail ? <p className="text-xs leading-5 text-black/60">{detail}</p> : null}
    </div>
  );
}

export function MeihuaChartView({ chart }: { chart: MeihuaChart }) {
  return (
    <div className="space-y-6">
      <Card className="rounded-xl border border-black/10 bg-white p-6 shadow-none md:p-8">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm leading-6">
            <MetaLine label="起卦时间" value={chart.meta.divinationDateTime} />
            <MetaLine label="起卦方式" value={formatMethod(chart.meta.method)} />
            <MetaLine label="干支" value={chart.meta.ganZhi} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-black/55">所问之事</p>
            <p className="text-sm leading-6 text-black/80">{chart.meta.question}</p>
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

          <section className="rounded-md border border-black/10 bg-white p-4 md:p-5">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black">体用关系</h3>
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <InfoItem
                    label="体卦"
                    value={chart.trigrams.body.name}
                    detail={`${chart.trigrams.body.nature} / ${chart.trigrams.body.element}`}
                  />
                  <InfoItem
                    label="用卦"
                    value={chart.trigrams.use.name}
                    detail={`${chart.trigrams.use.nature} / ${chart.trigrams.use.element}`}
                  />
                </div>
                <Badge className="rounded-full px-2.5 py-0.5 text-xs">{chart.relation.label}</Badge>
                <p className="text-xs leading-6 text-black/68">{chart.relation.summary}</p>
              </div>

              <div className="space-y-3 lg:border-l lg:border-black/10 lg:pl-6">
                <h3 className="text-lg font-semibold text-black">起卦数字</h3>
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
                  <InfoItem label="上卦数" value={chart.numbers.upper} />
                  <InfoItem label="下卦数" value={chart.numbers.lower} />
                  <InfoItem label="动爻" value={`第 ${chart.movingLine} 爻`} />
                </div>
                <p className="text-xs leading-6 text-black/60">{chart.numbers.source}</p>
              </div>
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
