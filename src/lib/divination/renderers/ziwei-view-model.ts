import type { ZiweiChart } from "@/types/divination";

const ringOrder = [0, 1, 2, 3, 11, null, null, 4, 10, null, null, 5, 9, 8, 7, 6];

export function getZiweiGrid(chart: ZiweiChart) {
  return ringOrder.map((index) =>
    index === null ? null : chart.palaces.find((palace) => palace.index === index) ?? null,
  );
}
