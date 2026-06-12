import type { ReactNode } from "react";
import { wuxingPalette } from "@/lib/constants";

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

function getPoint(index: number, total: number, radius: number) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;

  return {
    x: 160 + Math.cos(angle) * radius,
    y: 160 + Math.sin(angle) * radius,
  };
}

function toPoints(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function toCollapsedPoints(total: number) {
  return Array.from({ length: total }, () => "160,160").join(" ");
}

export function WuxingRadarChart({
  data,
  summary,
}: {
  data: WuxingRadarDatum[];
  summary?: ReactNode;
}) {
  const maxCount = Math.max(...data.map((item) => item.count), 1);
  const domainMax = Math.max(maxCount, 5);
  const dominantPalette = getWuxingPalette(data[0]?.element ?? "");
  const rings = [1, 2, 3, 4, 5].map((level) => (level / 5) * 112);
  const axisPoints = data.map((_, index) => getPoint(index, data.length, 112));
  const valuePoints = data.map((item, index) =>
    getPoint(index, data.length, (item.count / domainMax) * 112),
  );
  const collapsedPoints = toCollapsedPoints(data.length);
  const expandedPoints = toPoints(valuePoints);

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] leading-5 text-muted-foreground">
        {summary ? <div className="shrink-0 whitespace-nowrap">{summary}</div> : null}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {data.map((item) => (
            <span
              key={item.element}
              className="inline-flex items-center gap-1 text-[10px] font-medium"
              style={{
                color: getWuxingPalette(item.element).text,
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: getWuxingPalette(item.element).accent }}
              />
              <span>{item.element}</span>
              <span className="text-foreground/65">{item.count}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto aspect-square w-full max-w-[19rem]">
        <svg aria-label="五行雷达图" className="h-full w-full" role="img" viewBox="0 0 320 320">
          {rings.map((radius, index) => (
            <polygon
              key={radius}
              fill="none"
              points={toPoints(data.map((_, pointIndex) => getPoint(pointIndex, data.length, radius)))}
              stroke="rgba(22, 20, 17, 0.11)"
              strokeDasharray={index === rings.length - 1 ? "0" : "4 5"}
            />
          ))}

          {axisPoints.map((point, index) => (
            <line
              key={`axis-${data[index]?.element}`}
              stroke="rgba(22, 20, 17, 0.08)"
              x1="160"
              x2={point.x}
              y1="160"
              y2={point.y}
            />
          ))}

          {[0, 1, 2, 3, 4, 5].map((tick) => (
            <text
              key={tick}
              fill="rgba(22, 20, 17, 0.38)"
              fontSize="12"
              textAnchor="middle"
              x="150"
              y={160 - (tick / 5) * 112 + 4}
            >
              {tick}
            </text>
          ))}

          <g>
            <animateTransform
              attributeName="transform"
              begin="0.4s"
              calcMode="spline"
              dur="4.2s"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
              keyTimes="0;0.5;1"
              repeatCount="indefinite"
              type="matrix"
              values="
                0.978 0 0 0.978 3.52 3.52;
                1.028 0 0 1.028 -4.48 -4.48;
                0.978 0 0 0.978 3.52 3.52
              "
            />
            <animate
              attributeName="opacity"
              begin="0.4s"
              dur="4.2s"
              repeatCount="indefinite"
              values="0.92;1;0.92"
            />

            <polygon
              fill={dominantPalette.accent}
              fillOpacity="0.16"
              points={expandedPoints}
              stroke={dominantPalette.accent}
              strokeLinejoin="round"
              strokeWidth="2.5"
            >
              <animate
                attributeName="points"
                calcMode="spline"
                dur="0.4s"
                fill="freeze"
                keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                keyTimes="0;0.42;1"
                values={`${collapsedPoints};${collapsedPoints};${expandedPoints}`}
              />
            </polygon>

            <polygon
              fill={dominantPalette.accent}
              fillOpacity="0.08"
              points={expandedPoints}
              stroke="none"
            >
              <animate
                attributeName="points"
                calcMode="spline"
                dur="0.4s"
                fill="freeze"
                keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                keyTimes="0;0.42;1"
                values={`${collapsedPoints};${collapsedPoints};${expandedPoints}`}
              />
              <animate
                attributeName="fill-opacity"
                calcMode="spline"
                dur="0.4s"
                fill="freeze"
                keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                keyTimes="0;0.42;1"
                values="0;0.03;0.08"
              />
              <animate
                attributeName="fill-opacity"
                begin="0.4s"
                dur="4.2s"
                repeatCount="indefinite"
                values="0.04;0.18;0.04"
              />
            </polygon>
          </g>

          {valuePoints.map((point, index) => {
            const item = data[index];
            const palette = getWuxingPalette(item?.element ?? "");
            const pulseBegin = `${0.4 + index * 0.18}s`;

            return (
              <g key={`point-${item?.element}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  fill={palette.accent}
                  fillOpacity="0.1"
                  r="8"
                >
                  <animate
                    attributeName="cx"
                    calcMode="spline"
                    dur="0.4s"
                    fill="freeze"
                    keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                    keyTimes="0;0.42;1"
                    values={`160;160;${point.x}`}
                  />
                  <animate
                    attributeName="cy"
                    calcMode="spline"
                    dur="0.4s"
                    fill="freeze"
                    keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                    keyTimes="0;0.42;1"
                    values={`160;160;${point.y}`}
                  />
                  <animate
                    attributeName="r"
                    calcMode="spline"
                    dur="0.4s"
                    fill="freeze"
                    keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                    keyTimes="0;0.42;1"
                    values="0;3.5;8"
                  />
                  <animate
                    attributeName="fill-opacity"
                    calcMode="spline"
                    dur="0.4s"
                    fill="freeze"
                    keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                    keyTimes="0;0.42;1"
                    values="0;0.03;0.1"
                  />
                  <animate
                    attributeName="r"
                    begin={pulseBegin}
                    dur="3.2s"
                    repeatCount="indefinite"
                    values="6;11.5;6"
                  />
                  <animate
                    attributeName="fill-opacity"
                    begin={pulseBegin}
                    dur="3.2s"
                    repeatCount="indefinite"
                    values="0.04;0.24;0.04"
                  />
                </circle>

                <circle
                  cx={point.x}
                  cy={point.y}
                  fill={palette.accent}
                  r="4.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                >
                  <animate
                    attributeName="cx"
                    calcMode="spline"
                    dur="0.4s"
                    fill="freeze"
                    keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                    keyTimes="0;0.42;1"
                    values={`160;160;${point.x}`}
                  />
                  <animate
                    attributeName="cy"
                    calcMode="spline"
                    dur="0.4s"
                    fill="freeze"
                    keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                    keyTimes="0;0.42;1"
                    values={`160;160;${point.y}`}
                  />
                  <animate
                    attributeName="r"
                    calcMode="spline"
                    dur="0.4s"
                    fill="freeze"
                    keySplines="0.45 0 0.7 0.2;0.2 0.8 0.2 1"
                    keyTimes="0;0.42;1"
                    values="0;2.2;4.5"
                  />
                  <animate
                    attributeName="r"
                    begin={pulseBegin}
                    dur="3.2s"
                    repeatCount="indefinite"
                    values="4.2;5.4;4.2"
                  />
                </circle>
              </g>
            );
          })}

          {axisPoints.map((point, index) => {
            const item = data[index];
            const labelPoint = getPoint(index, data.length, 132);
            const palette = getWuxingPalette(item?.element ?? "");

            return (
              <text
                key={`label-${item?.element}`}
                fill={palette.accent}
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
                x={labelPoint.x}
                y={labelPoint.y + 5}
              >
                {item?.element}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
