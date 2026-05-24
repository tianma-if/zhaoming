import { Solar } from "lunar-typescript";
import type { MeihuaChart, MeihuaRelation, MeihuaTrigram } from "@/types/divination";
import type { MeihuaInput } from "../schemas";
import { getHexagramByLines } from "../liuyao-hexagrams";

const TRIGRAMS: MeihuaTrigram[] = [
  { number: 1, name: "乾", nature: "天", element: "金", code: "111" },
  { number: 2, name: "兑", nature: "泽", element: "金", code: "110" },
  { number: 3, name: "离", nature: "火", element: "火", code: "101" },
  { number: 4, name: "震", nature: "雷", element: "木", code: "100" },
  { number: 5, name: "巽", nature: "风", element: "木", code: "011" },
  { number: 6, name: "坎", nature: "水", element: "水", code: "010" },
  { number: 7, name: "艮", nature: "山", element: "土", code: "001" },
  { number: 8, name: "坤", nature: "地", element: "土", code: "000" },
];

const ZHI_NUMBERS: Record<string, number> = {
  子: 1,
  丑: 2,
  寅: 3,
  卯: 4,
  辰: 5,
  巳: 6,
  午: 7,
  未: 8,
  申: 9,
  酉: 10,
  戌: 11,
  亥: 12,
};

const GENERATES: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const CONTROLS: Record<string, string> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

function normalizeModulo(value: number, modulo: number) {
  return ((value - 1) % modulo) + 1;
}

function getTrigramByNumber(value: number) {
  return TRIGRAMS[normalizeModulo(value, 8) - 1]!;
}

function parseDateTime(input: MeihuaInput) {
  const [year, month, day] = input.divinationDate.split("-").map(Number);
  const [hour, minute] = input.divinationTime.split(":").map(Number);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();

  return { year, month, day, hour, minute, solar, lunar };
}

function getLines(upper: MeihuaTrigram, lower: MeihuaTrigram) {
  return [...lower.code, ...upper.code].map((value) => (value === "1" ? 1 : 0));
}

function flipLine(lines: number[], movingLine: number) {
  return lines.map((value, index) => (index === movingLine - 1 ? (value ? 0 : 1) : value));
}

function getMutualLines(lines: number[]) {
  return [lines[1]!, lines[2]!, lines[3]!, lines[2]!, lines[3]!, lines[4]!];
}

function getBodyUse(upper: MeihuaTrigram, lower: MeihuaTrigram, movingLine: number) {
  if (movingLine <= 3) {
    return { body: upper, use: lower };
  }

  return { body: lower, use: upper };
}

function getRelation(body: MeihuaTrigram, use: MeihuaTrigram): MeihuaRelation {
  const bodyElement = body.element;
  const useElement = use.element;

  if (bodyElement === useElement) {
    return {
      bodyTrigram: body.name,
      useTrigram: use.name,
      bodyElement,
      useElement,
      relation: "same",
      label: "体用比和",
      summary: "体卦与用卦五行相同，主客力量相近，宜稳中推进，重视协同与节奏。",
    };
  }

  if (GENERATES[bodyElement] === useElement) {
    return {
      bodyTrigram: body.name,
      useTrigram: use.name,
      bodyElement,
      useElement,
      relation: "body-generates-use",
      label: "体生用",
      summary: "体卦生用卦，自己对事情投入较多，短期会有消耗，适合主动铺垫但要控成本。",
    };
  }

  if (GENERATES[useElement] === bodyElement) {
    return {
      bodyTrigram: body.name,
      useTrigram: use.name,
      bodyElement,
      useElement,
      relation: "use-generates-body",
      label: "用生体",
      summary: "用卦生体卦，外部条件对自己有助力，适合承接资源、借势推进。",
    };
  }

  if (CONTROLS[bodyElement] === useElement) {
    return {
      bodyTrigram: body.name,
      useTrigram: use.name,
      bodyElement,
      useElement,
      relation: "body-controls-use",
      label: "体克用",
      summary: "体卦克用卦，自己能影响局面，但需要主动管理阻力，避免用力过猛。",
    };
  }

  return {
    bodyTrigram: body.name,
    useTrigram: use.name,
    bodyElement,
    useElement,
    relation: "use-controls-body",
    label: "用克体",
    summary: "用卦克体卦，外部压力更明显，宜先守后动，降低风险暴露。",
  };
}

function getGuidance(relation: MeihuaRelation, movingLine: number) {
  const timing =
    movingLine <= 2
      ? "动爻在下，事情多从基础条件或初始行动处起变化。"
      : movingLine <= 4
        ? "动爻居中，变化多落在沟通、执行与过程调整。"
        : "动爻在上，结果、名义、对外呈现或收尾方式更关键。";

  return [
    timing,
    relation.summary,
    "本功能提供梅花易数的结构化起卦结果，具体判断仍需结合问题背景与 AI 解读交叉校验。",
  ];
}

export function buildMeihuaChart(input: MeihuaInput): {
  chart: MeihuaChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
} {
  const { lunar } = parseDateTime(input);
  const dateTimeText = `${input.divinationDate} ${input.divinationTime}:00`;
  const ganZhi = `${lunar.getYearInGanZhiExact()}年 ${lunar.getMonthInGanZhiExact()}月 ${lunar.getDayInGanZhiExact()}日 ${lunar.getTimeInGanZhi()}时`;
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();
  const yearZhi = lunar.getYearZhi();
  const timeZhi = lunar.getTimeZhi();
  const yearNumber = ZHI_NUMBERS[yearZhi] ?? 1;
  const hourNumber = ZHI_NUMBERS[timeZhi] ?? 1;

  const timeUpperNumber = yearNumber + lunarMonth + lunarDay;
  const timeLowerNumber = timeUpperNumber + hourNumber;
  const upperNumber = input.method === "number" ? input.upperNumber! : timeUpperNumber;
  const lowerNumber = input.method === "number" ? input.lowerNumber! : timeLowerNumber;
  const movingNumber =
    input.method === "number"
      ? (input.movingNumber || input.upperNumber! + input.lowerNumber!)
      : timeLowerNumber;
  const upper = getTrigramByNumber(upperNumber);
  const lower = getTrigramByNumber(lowerNumber);
  const movingLine = normalizeModulo(movingNumber, 6);
  const { body, use } = getBodyUse(upper, lower, movingLine);
  const relation = getRelation(body, use);
  const baseLines = getLines(upper, lower);
  const changedLines = flipLine(baseLines, movingLine);

  return {
    chart: {
      kind: "meihua",
      meta: {
        method: input.method,
        divinationDateTime: dateTimeText,
        lunar: lunar.toString(),
        ganZhi,
        question: input.question,
        subjectName: input.subjectName,
        gender: input.gender,
        notes: input.notes || undefined,
      },
      numbers: {
        upper: upperNumber,
        lower: lowerNumber,
        moving: movingNumber,
        source:
          input.method === "time"
            ? `年支${yearZhi}(${yearNumber}) + 农历${lunarMonth}月${lunarDay}日 + ${timeZhi}时(${hourNumber})`
            : `上卦数${upperNumber}，下卦数${lowerNumber}，动爻数${movingNumber}`,
      },
      trigrams: {
        upper,
        lower,
        body,
        use,
      },
      movingLine,
      originalHexagram: getHexagramByLines(baseLines),
      mutualHexagram: getHexagramByLines(getMutualLines(baseLines)),
      changedHexagram: getHexagramByLines(changedLines),
      relation,
      guidance: getGuidance(relation, movingLine),
    },
    birthGregorian: dateTimeText,
    birthLunar: {
      label: lunar.toString(),
      ganZhi,
      method: input.method,
      upperNumber,
      lowerNumber,
      movingNumber,
      movingLine,
    },
  };
}
