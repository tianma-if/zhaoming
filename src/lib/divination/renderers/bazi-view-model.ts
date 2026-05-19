import type { BaziChart } from "@/types/divination";
import { Lunar, Solar } from "lunar-typescript";
import { splitWuxing } from "../normalize";

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
const branchToElement: Record<string, string> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};
const stemPolarity: Record<string, "yang" | "yin"> = {
  甲: "yang",
  乙: "yin",
  丙: "yang",
  丁: "yin",
  戊: "yang",
  己: "yin",
  庚: "yang",
  辛: "yin",
  壬: "yang",
  癸: "yin",
};
const generates: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};
const controls: Record<string, string> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

function parseSolarDateTime(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/,
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;

  return Solar.fromYmdHms(
    Number(year),
    Number(month),
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getTenGod(dayStem: string, targetStem: string) {
  const dayElement = stemToElement[dayStem];
  const targetElement = stemToElement[targetStem];
  const samePolarity = stemPolarity[dayStem] === stemPolarity[targetStem];

  if (!dayElement || !targetElement) {
    return "";
  }

  if (targetElement === dayElement) {
    return samePolarity ? "比肩" : "劫财";
  }

  if (generates[targetElement] === dayElement) {
    return samePolarity ? "偏印" : "正印";
  }

  if (generates[dayElement] === targetElement) {
    return samePolarity ? "食神" : "伤官";
  }

  if (controls[dayElement] === targetElement) {
    return samePolarity ? "偏财" : "正财";
  }

  if (controls[targetElement] === dayElement) {
    return samePolarity ? "七杀" : "正官";
  }

  return "";
}

function getBaziShenSha(chart: BaziChart) {
  const solar = parseSolarDateTime(chart.meta.solar);

  if (!solar) {
    return [];
  }

  const lunar = Lunar.fromSolar(solar);

  return [
    { label: "吉神宜趋", values: uniq(lunar.getDayJiShen()) },
    { label: "凶煞宜忌", values: uniq(lunar.getDayXiongSha()) },
    {
      label: "天神",
      values: uniq([
        `${lunar.getDayTianShen()}（${lunar.getDayTianShenType()}）`,
        `${lunar.getTimeTianShen()}（${lunar.getTimeTianShenType()}）`,
      ]),
    },
    {
      label: "冲煞",
      values: uniq([lunar.getDayChongDesc(), `煞${lunar.getDaySha()}`]),
    },
  ].filter((group) => group.values.length > 0);
}

function getBaziDaYun(chart: BaziChart) {
  const solar = parseSolarDateTime(chart.meta.solar);
  const dayStem = chart.pillars.find((pillar) => pillar.key === "day")?.heavenlyStem ?? "";

  if (!solar) {
    return null;
  }

  const lunar = Lunar.fromSolar(solar);
  const gender = chart.meta.gender === "female" ? 0 : 1;
  const yun = lunar.getEightChar().getYun(gender, 2);
  const startSolar = yun.getStartSolar();
  const daYun = yun.getDaYun(11);
  const currentYear = new Date().getFullYear();
  const current = daYun.find(
    (period) => period.getIndex() > 0 && currentYear >= period.getStartYear() && currentYear <= period.getEndYear(),
  );

  return {
    startLabel: `出生${yun.getStartYear()}年${yun.getStartMonth()}个月${yun.getStartDay()}天${yun.getStartHour()}小时后起运`,
    startSolar: startSolar.toYmdHms().slice(0, 16),
    current: current
      ? {
          ageRange: `${current.getStartAge() + 1}-${current.getEndAge() + 1}岁`,
          ganZhi: current.getGanZhi(),
          tenGod: getTenGod(dayStem, current.getGanZhi().slice(0, 1)),
        }
      : null,
    periods: daYun.map((period) => {
      const ganZhi = period.getGanZhi();
      const stem = ganZhi.slice(0, 1);
      const branch = ganZhi.slice(1, 2);

      return {
        index: period.getIndex(),
        startYear: period.getStartYear(),
        ageRange:
          period.getIndex() === 0
            ? "1-3岁"
            : `${period.getStartAge() + 1}-${period.getEndAge() + 1}岁`,
        ganZhi,
        tenGod: stem ? getTenGod(dayStem, stem) : "小运阶段",
        stemElement: stemToElement[stem] ?? "",
        branchElement: branchToElement[branch] ?? "",
      };
    }),
  };
}

export function getBaziViewModel(chart: BaziChart) {
  const pillars = chart.pillars.map((pillar) => ({
    ...pillar,
    elements: splitWuxing(pillar.wuXing),
    hiddenStemDetails: pillar.hiddenStems.map((stem, index) => ({
      stem,
      shiShen: pillar.shiShenZhi?.[index] ?? "",
    })),
  }));

  return {
    pillars,
    shenSha: getBaziShenSha(chart),
    daYun: getBaziDaYun(chart),
    summary: [
      ...(chart.meta.inputSolar && chart.meta.inputSolar !== chart.meta.solar
        ? [{ label: "输入时间", value: chart.meta.inputSolar }]
        : []),
      { label: "排盘时间", value: chart.meta.solar },
      { label: "农历", value: chart.meta.lunar },
      ...(chart.meta.birthPlace ? [{ label: "出生地", value: chart.meta.birthPlace }] : []),
      ...(chart.meta.timezone ? [{ label: "时区", value: chart.meta.timezone }] : []),
      ...(chart.meta.longitudeCorrectionMinutes
        ? [{ label: "经度修正", value: `${chart.meta.longitudeCorrectionMinutes} 分钟` }]
        : []),
      { label: "生肖", value: chart.meta.zodiac },
      { label: "命宫", value: chart.derived.mingGong },
      { label: "身宫", value: chart.derived.shenGong },
      { label: "胎元", value: chart.derived.taiYuan },
    ],
  };
}
