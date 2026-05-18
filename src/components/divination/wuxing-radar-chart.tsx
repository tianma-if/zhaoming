"use client";

import dynamic from "next/dynamic";
import type { RadarConfig } from "@ant-design/plots";
import { wuxingPalette } from "@/lib/constants";

const Radar = dynamic(
  () => import("@ant-design/plots").then((module) => module.Radar),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[18rem] items-center justify-center rounded-[1rem] border border-border bg-muted/40 text-sm text-muted-foreground">
        五行图谱载入中
      </div>
    ),
  },
);

const defaultPalette = {
  bg: "#f6f6f4",
  border: "#d8d2c5",
  text: "#6e6a64",
  accent: "#d89a1d",
};

function getWuxingPalette(element: string) {
  return wuxingPalette[element] ?? defaultPalette;
}

export interface WuxingRadarDatum {
  element: string;
  count: number;
}

export function WuxingRadarChart({ data }: { data: WuxingRadarDatum[] }) {
  const maxCount = Math.max(...data.map((item) => item.count), 1);
  const chartData = data.map((item) => ({
    ...item,
    reading: "当前命盘",
  }));
  const dominantPalette = getWuxingPalette(chartData[0]?.element ?? "");

  const config: RadarConfig = {
    data: chartData,
    xField: "element",
    yField: "count",
    seriesField: "reading",
    height: 300,
    autoFit: true,
    coordinateType: "polar",
    colorField: "reading",
    scale: {
      y: {
        domain: [0, Math.max(maxCount, 4)],
        nice: true,
      },
    },
    axis: {
      x: {
        grid: true,
        line: true,
        labelFormatter: (element: string) => element,
        labelFill: (element: string) => getWuxingPalette(element).accent,
        labelFontSize: 13,
        labelFontWeight: 600,
      },
      y: {
        title: false,
        grid: true,
        line: false,
        labelFormatter: (value: number) => `${value}`,
        labelFill: "rgba(22, 20, 17, 0.45)",
      },
    },
    legend: false,
    tooltip: {
      title: (datum: WuxingRadarDatum) => datum.element,
      items: [
        {
          name: "结构信号",
          field: "count",
          valueFormatter: (value: number) => `${value} 个`,
        },
      ],
    },
    area: {
      style: {
        fill: dominantPalette.accent,
        fillOpacity: 0.18,
      },
    },
    line: {
      style: {
        stroke: dominantPalette.accent,
        lineWidth: 2,
      },
    },
    point: {
      colorField: "element",
      scale: {
        color: {
          range: chartData.map((item) => getWuxingPalette(item.element).accent),
        },
      },
      style: {
        fill: (datum: WuxingRadarDatum) => getWuxingPalette(datum.element).accent,
        stroke: "#ffffff",
        lineWidth: 2,
        r: 4,
      },
    },
    theme: {
      type: "classic",
    },
  };

  return (
    <div className="space-y-3 rounded-[1.1rem] border border-border bg-muted/30 px-3 py-4">
      <div className="flex flex-wrap justify-center gap-2">
        {data.map((item) => (
          <div
            key={item.element}
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: getWuxingPalette(item.element).bg,
              borderColor: getWuxingPalette(item.element).border,
              color: getWuxingPalette(item.element).text,
            }}
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: getWuxingPalette(item.element).accent }}
            />
            <span>{item.element}</span>
            <span className="text-foreground/65">{item.count}</span>
          </div>
        ))}
      </div>
      <Radar {...config} />
    </div>
  );
}
