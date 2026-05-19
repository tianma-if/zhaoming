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

export function WuxingRadarChart({ data }: { data: WuxingRadarDatum[] }) {
  const maxCount = Math.max(...data.map((item) => item.count), 1);
  const domainMax = Math.max(maxCount, 5);
  const dominantPalette = getWuxingPalette(data[0]?.element ?? "");
  const rings = [1, 2, 3, 4, 5].map((level) => (level / 5) * 112);
  const axisPoints = data.map((_, index) => getPoint(index, data.length, 112));
  const valuePoints = data.map((item, index) =>
    getPoint(index, data.length, (item.count / domainMax) * 112),
  );

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

      <div className="mx-auto aspect-square w-full max-w-[24rem]">
        <svg
          aria-label="五行雷达图"
          className="h-full w-full"
          role="img"
          viewBox="0 0 320 320"
        >
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

          <polygon
            fill={dominantPalette.accent}
            fillOpacity="0.16"
            points={toPoints(valuePoints)}
            stroke={dominantPalette.accent}
            strokeLinejoin="round"
            strokeWidth="2.5"
          />

          {valuePoints.map((point, index) => {
            const item = data[index];
            const palette = getWuxingPalette(item?.element ?? "");

            return (
              <circle
                key={`point-${item?.element}`}
                cx={point.x}
                cy={point.y}
                fill={palette.accent}
                r="4.5"
                stroke="#ffffff"
                strokeWidth="2"
              />
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
