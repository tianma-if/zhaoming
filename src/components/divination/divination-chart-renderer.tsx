"use client";

import { BaziChartView } from "@/components/divination/bazi-chart";
import { BaziInsights } from "@/components/divination/bazi-insights";
import { ChengguChartView } from "@/components/divination/chenggu-chart";
import { LiuyaoChartView } from "@/components/divination/liuyao-chart";
import { MeihuaChartView } from "@/components/divination/meihua-chart";
import { SanshiChartView } from "@/components/divination/sanshi-chart";
import { ZiweiChartView } from "@/components/divination/ziwei-chart";
import { buildZiweiChart } from "@/lib/divination/adapters/ziwei";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import { divinationInputSchema } from "@/lib/divination/schemas";
import type { Database } from "@/types/database";
import type {
  BaziChart,
  ChengguChart,
  LiuyaoChart,
  MeihuaChart,
  SanshiChart,
  ZiweiChart,
} from "@/types/divination";

type DivinationLikeRecord = Pick<
  Database["public"]["Tables"]["divinations"]["Row"],
  "divination_type" | "subject_name"
> & {
  input_params: unknown;
  chart_json: unknown;
};

export function DivinationChartRenderer({ record }: { record: DivinationLikeRecord }) {
  const divinationType = resolveDivinationTypeFromRecord(
    record as Pick<
      Database["public"]["Tables"]["divinations"]["Row"],
      "divination_type" | "input_params" | "chart_json"
    >,
  );
  const sanshiChart =
    divinationType === "sanshi" ? (record.chart_json as unknown as SanshiChart) : null;

  const ziweiChart =
    divinationType === "ziwei"
      ? (() => {
          const parsed = divinationInputSchema.safeParse(record.input_params);

          if (parsed.success && parsed.data.divinationType === "ziwei") {
            return buildZiweiChart(parsed.data).chart;
          }

          return record.chart_json as unknown as ZiweiChart;
        })()
      : null;

  return divinationType === "bazi" ? (
    <>
      <BaziChartView chart={record.chart_json as unknown as BaziChart} />
      <BaziInsights chart={record.chart_json as unknown as BaziChart} />
    </>
  ) : divinationType === "ziwei" ? (
    <ZiweiChartView chart={ziweiChart as ZiweiChart} subjectName={record.subject_name} />
  ) : divinationType === "liuyao" ? (
    <LiuyaoChartView chart={record.chart_json as unknown as LiuyaoChart} />
  ) : divinationType === "meihua" ? (
    <MeihuaChartView chart={record.chart_json as unknown as MeihuaChart} />
  ) : divinationType === "sanshi" ? (
    <SanshiChartView chart={sanshiChart as SanshiChart} />
  ) : (
    <ChengguChartView chart={record.chart_json as unknown as ChengguChart} />
  );
}
