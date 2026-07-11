"use client";

import type { MeihuaChart } from "@/types/divination";
import { CopyContentButton } from "@/components/divination/copy-content-button";
import { LiuyaoYaoGlyph } from "@/components/divination/liuyao-yao-glyph";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/components/i18n-provider";

const lineLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;

function formatMethod(method: MeihuaChart["meta"]["method"], t: (key: string) => string) {
  return method === "time" ? t("chart.timeCast") : t("chart.numberCast");
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

function buildMeihuaSummaryText(chart: MeihuaChart, t: (key: string) => string) {
  return [
    `起卦时间：${chart.meta.divinationDateTime}`,
    `${t("chart.method")}：${formatMethod(chart.meta.method, t)}`,
    `干支：${chart.meta.ganZhi}`,
    `所问之事：${chart.meta.question}`,
    `本卦：${chart.originalHexagram.name}（${chart.originalHexagram.upperTrigram}上${chart.originalHexagram.lowerTrigram}下）`,
    `互卦：${chart.mutualHexagram.name}（${chart.mutualHexagram.upperTrigram}上${chart.mutualHexagram.lowerTrigram}下）`,
    `变卦：${chart.changedHexagram.name}（${chart.changedHexagram.upperTrigram}上${chart.changedHexagram.lowerTrigram}下）`,
    `体卦：${chart.trigrams.body.name} ${chart.trigrams.body.nature}/${chart.trigrams.body.element}`,
    `用卦：${chart.trigrams.use.name} ${chart.trigrams.use.nature}/${chart.trigrams.use.element}`,
    `关系：${chart.relation.label}`,
    `上卦数：${chart.numbers.upper}`,
    `下卦数：${chart.numbers.lower}`,
    `动爻：第 ${chart.movingLine} 爻`,
    `取数来源：${chart.numbers.source}`,
  ].join("\n");
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
  const { t } = useI18n();
  const summaryText = buildMeihuaSummaryText(chart, t);

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border border-black/10 bg-white p-6 shadow-none md:p-8">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm leading-6">
            <MetaLine label={t("chart.castTime")} value={chart.meta.divinationDateTime} />
            <MetaLine label={t("chart.method")} value={formatMethod(chart.meta.method, t)} />
              <MetaLine label={t("chart.ganZhi")} value={chart.meta.ganZhi} />
            <div className="basis-full" />
            <MetaLine label={t("divination.question")} value={chart.meta.question} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <HexagramPanel
              title={t("chart.original")}
              name={chart.originalHexagram.name}
              subtitle={`${chart.originalHexagram.upperTrigram}上${chart.originalHexagram.lowerTrigram}下`}
              keyCode={chart.originalHexagram.key}
              movingLine={chart.movingLine}
            />
            <HexagramPanel
              title={t("chart.mutual")}
              name={chart.mutualHexagram.name}
              subtitle={`${chart.mutualHexagram.upperTrigram}上${chart.mutualHexagram.lowerTrigram}下`}
              keyCode={chart.mutualHexagram.key}
            />
            <HexagramPanel
              title={t("chart.changed")}
              name={chart.changedHexagram.name}
              subtitle={`${chart.changedHexagram.upperTrigram}上${chart.changedHexagram.lowerTrigram}下`}
              keyCode={chart.changedHexagram.key}
            />
          </div>

          <section className="rounded-md border border-black/10 bg-white p-4 md:p-5">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black">{t("chart.bodyUse")}</h3>
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <InfoItem
                  label={t("chart.body")}
                    value={chart.trigrams.body.name}
                    detail={`${chart.trigrams.body.nature} / ${chart.trigrams.body.element}`}
                  />
                  <InfoItem
                    label={t("chart.use")}
                    value={chart.trigrams.use.name}
                    detail={`${chart.trigrams.use.nature} / ${chart.trigrams.use.element}`}
                />
              </div>
              <Badge className="rounded-full px-2.5 py-0.5 text-xs">{chart.relation.label}</Badge>
            </div>

              <div className="space-y-3 lg:border-l lg:border-black/10 lg:pl-6">
                <h3 className="text-lg font-semibold text-black">{t("chart.numbers")}</h3>
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
                  <InfoItem label={t("chart.upper")} value={chart.numbers.upper} />
                  <InfoItem label={t("chart.lower")} value={chart.numbers.lower} />
                  <InfoItem label={t("divination.movingLines")} value={`第 ${chart.movingLine} 爻`} />
                </div>
                <p className="text-xs leading-6 text-black/60">{chart.numbers.source}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <CopyContentButton label={t("chart.copy")} text={summaryText} />
            </div>
          </section>

          {chart.meta.notes ? (
            <div className="space-y-4 border-t border-black/8 pt-6">
              <h3 className="text-2xl font-semibold text-black">{t("chart.additionalContext")}</h3>
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
