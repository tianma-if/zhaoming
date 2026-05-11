export function stringifyChart(chart: unknown) {
  return JSON.stringify(chart, null, 2);
}

export function splitWuxing(value: string) {
  return value.split("").filter(Boolean);
}

export function hourToZiWeiIndex(hour: number) {
  return Math.floor(((hour + 1) % 24) / 2) + 1;
}
