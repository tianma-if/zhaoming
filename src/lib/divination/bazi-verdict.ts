import type { BaziChart } from "@/types/divination";

const stemToElement: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const elementTone: Record<string, string> = {
  木: "生发、规划与创造",
  火: "表达、热度与行动",
  土: "承载、秩序与现实感",
  金: "判断、边界与执行",
  水: "流动、洞察与适应",
};

export function countBaziElements(chart: BaziChart) {
  const counts: Record<string, number> = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0,
  };

  for (const pillar of chart.pillars) {
    for (const element of pillar.wuXing.split("")) {
      if (counts[element] !== undefined) {
        counts[element] += 1;
      }
    }

    for (const stem of pillar.hiddenStems) {
      const element = stemToElement[stem];
      if (element) {
        counts[element] += 1;
      }
    }
  }

  return Object.entries(counts)
    .map(([element, count]) => ({ element, count }))
    .sort((a, b) => b.count - a.count);
}

export function getBaziDayMaster(chart: BaziChart) {
  const dayStem = chart.pillars.find((pillar) => pillar.key === "day")?.heavenlyStem ?? "";

  return {
    stem: dayStem,
    element: stemToElement[dayStem] ?? "未知",
  };
}

export function buildBaziStructureVerdict(chart: BaziChart) {
  const dayMaster = getBaziDayMaster(chart);
  const counts = countBaziElements(chart);
  const strongest = counts[0];
  const weakest = counts[counts.length - 1];
  const monthPillar = chart.pillars.find((pillar) => pillar.key === "month");
  const monthLabel = monthPillar
    ? `${monthPillar.heavenlyStem}${monthPillar.earthlyBranch}月`
    : "月令";

  return [
    `${dayMaster.stem}${dayMaster.element}日主生于${monthLabel}，盘面以${strongest.element}气最显，呈现出“${elementTone[strongest.element]}”被放大的结构。`,
    `这类命盘通常不是轻飘的灵感型，而是先承压、再成形：越在复杂环境里，越容易长出稳定的判断和可落地的能力。`,
    weakest.count === 0
      ? `${weakest.element}气暂不显，适合有意识地补入${elementTone[weakest.element]}，让整张盘从偏重走向更舒展。`
      : `${weakest.element}气相对较弱，后天若能补入${elementTone[weakest.element]}，整体状态会更通透。`,
  ].join("");
}

export function extractOpeningVerdict(markdown: string | null) {
  if (!markdown) {
    return "";
  }

  return markdown
    .replace(/^#+\s*/gm, "")
    .split(/\n{2,}/)
    .map((block) => block.replace(/[*_>`-]/g, "").trim())
    .find((block) => block.length > 24) ?? "";
}
