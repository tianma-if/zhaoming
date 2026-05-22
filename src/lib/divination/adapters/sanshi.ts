import { Solar } from "lunar-typescript";
import type {
  QimenBoard,
  QimenPalace,
  SanshiChart,
  SanshiSector,
  SanshiSignal,
  SanshiSystem,
  SanshiTopic,
} from "@/types/divination";
import type { SanshiInput } from "../schemas";

const SYSTEM_LABELS: Record<SanshiSystem, string> = {
  qimen: "奇门遁甲",
  taiyi: "太乙神数",
  liuren: "大六壬",
};

const TOPIC_LABELS: Record<SanshiTopic, string> = {
  career: "事业推进",
  wealth: "财务合作",
  relationship: "关系情感",
  study: "学习考试",
  travel: "出行迁动",
  lawsuit: "谈判纠纷",
  health: "健康调理",
  general: "综合判断",
};

const SECTOR_BLUEPRINTS: Array<Pick<SanshiSector, "key" | "label">> = [
  { key: "timing", label: "时机判断" },
  { key: "initiative", label: "主动策略" },
  { key: "coordination", label: "协同关系" },
  { key: "risk", label: "风险边界" },
];

const FAVORABLE_SUMMARIES = [
  "局势较容易接住外部资源，适合顺势推进，不宜反复试探。",
  "当前更像窗口期已经打开，关键在于节奏稳、动作准，而不是再等一个更完美的信号。",
  "整体气口偏开，主动表达和明确动作会比观望更有回报。",
];

const NEUTRAL_SUMMARIES = [
  "局面并不封闭，但也没有形成单边优势，更适合边走边校正。",
  "信息仍在流动，先做小步验证，再决定是否加码，会比一次性押注更稳。",
  "眼下更像过渡段，先理顺顺序和优先级，结果会比急于求成更好。",
];

const CAUTIOUS_SUMMARIES = [
  "这一步容易在细节上失分，贸然推进反而会放大阻力。",
  "局势提示先收口、先整理、先查漏，比硬冲更有价值。",
  "当前不利于情绪化判断，越急越容易错把噪音当信号。",
];

const ACTIONS: Record<SanshiSector["key"], string[]> = {
  timing: [
    "把行动拆成两个阶段：先确认口径，再正式推进。",
    "优先处理最接近结果的一步，不要同时开太多线。",
    "如果必须做决定，宜先小范围试行，再扩展到全局。",
  ],
  initiative: [
    "主动方更有优势，但表达要具体，避免只停留在态度层面。",
    "先给出一个可执行版本，往往比继续解释更能推动局面。",
    "这件事适合你先定框架，再邀请对方进入，而不是反过来等待。",
  ],
  coordination: [
    "相关人之间需要统一节奏，最好先对齐目标和边界。",
    "若涉及合作，先把利益分配和责任划分说清楚。",
    "这一步成败不只取决于你自己，还取决于沟通链条是否顺畅。",
  ],
  risk: [
    "最需要防的是信息不全时过度乐观，关键节点请二次确认。",
    "不要把压力转化成提速，先守住底线和备用方案。",
    "真正的风险不一定在正面冲突，而在后续执行是否失控。",
  ],
};

const QIMEN_PALACE_LAYOUT = [
  { index: 4, row: 1, col: 1, palace: "巽四宫", direction: "东南" },
  { index: 9, row: 1, col: 2, palace: "离九宫", direction: "正南" },
  { index: 2, row: 1, col: 3, palace: "坤二宫", direction: "西南" },
  { index: 3, row: 2, col: 1, palace: "震三宫", direction: "正东" },
  { index: 5, row: 2, col: 2, palace: "中五宫", direction: "中宫" },
  { index: 7, row: 2, col: 3, palace: "兑七宫", direction: "正西" },
  { index: 8, row: 3, col: 1, palace: "艮八宫", direction: "东北" },
  { index: 1, row: 3, col: 2, palace: "坎一宫", direction: "正北" },
  { index: 6, row: 3, col: 3, palace: "乾六宫", direction: "西北" },
] as const;

const QIMEN_EARTH_STEMS = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"] as const;
const QIMEN_DOORS = ["休门", "生门", "伤门", "杜门", "景门", "死门", "惊门", "开门"] as const;
const QIMEN_STARS = ["天蓬", "天任", "天冲", "天辅", "天英", "天芮", "天柱", "天心", "天禽"] as const;
const QIMEN_DEITIES = ["值符", "螣蛇", "太阴", "六合", "白虎", "玄武", "九地", "九天"] as const;

function hashSeed(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function pickBySeed<T>(items: readonly T[], seed: number, offset = 0) {
  return items[(seed + offset) % items.length]!;
}

function rotate<T>(items: readonly T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]!);
}

function getTone(seed: number, offset: number): SanshiSector["tone"] {
  const value = (seed + offset) % 9;

  if (value <= 2) return "favorable";
  if (value <= 5) return "neutral";
  return "cautious";
}

function getToneSummary(tone: SanshiSector["tone"], seed: number, offset: number) {
  if (tone === "favorable") return pickBySeed(FAVORABLE_SUMMARIES, seed, offset);
  if (tone === "neutral") return pickBySeed(NEUTRAL_SUMMARIES, seed, offset);
  return pickBySeed(CAUTIOUS_SUMMARIES, seed, offset);
}

function getNineStarName(input: SanshiInput, star: ReturnType<ReturnType<Solar["getLunar"]>["getTimeNineStar"]>) {
  if (input.system === "qimen") return star.getNameInQiMen();
  if (input.system === "taiyi") return star.getNameInTaiYi();
  return star.getNameInBeiDou();
}

function getSignals(input: SanshiInput, lunar: ReturnType<Solar["getLunar"]>, qimenBoard?: QimenBoard): SanshiSignal[] {
  const time = lunar.getTime();
  const timeNineStar = lunar.getTimeNineStar();

  return [
    {
      label: "所用流派",
      value: SYSTEM_LABELS[input.system],
    },
    {
      label: "当前主题",
      value: TOPIC_LABELS[input.topic],
    },
    {
      label: "时支与旬空",
      value: `${time.getGanZhi()} / ${time.getXunKong()}`,
    },
    {
      label: "九星时势",
      value: `${timeNineStar.getNumber()}${timeNineStar.getColor()}${getNineStarName(input, timeNineStar)}`,
    },
    ...(qimenBoard
      ? [
          {
            label: "值符值使",
            value: `${qimenBoard.chiefDeity} / ${qimenBoard.dutyDoor}`,
          },
        ]
      : []),
    {
      label: "喜财方位",
      value: `${lunar.getPositionXiDesc()} / ${lunar.getPositionCaiDesc()}`,
    },
    {
      label: "当日宜忌",
      value: `${lunar.getDayYi(2).slice(0, 3).join("、") || "无特别宜项"} / ${lunar.getDayJi(2).slice(0, 3).join("、") || "无特别忌项"}`,
    },
  ];
}

function getSectors(seed: number): SanshiSector[] {
  return SECTOR_BLUEPRINTS.map((item, index) => {
    const tone = getTone(seed, index * 7);

    return {
      key: item.key,
      label: item.label,
      tone,
      summary: getToneSummary(tone, seed, index * 3),
      action: pickBySeed(ACTIONS[item.key], seed, index * 5),
    };
  });
}

function getQimenDun(month: number): QimenBoard["dun"] {
  return month >= 5 && month <= 10 ? "yin" : "yang";
}

function buildQimenBoard(input: SanshiInput, lunar: ReturnType<Solar["getLunar"]>, seed: number): QimenBoard {
  const hour = lunar.getTime();
  const month = lunar.getMonth();
  const ju = ((month + lunar.getDay() + hour.getZhiIndex()) % 9) + 1;
  const dun = getQimenDun(month);
  const dutyIndex = seed % QIMEN_PALACE_LAYOUT.length;
  const chiefStarIndex = (seed + 2) % QIMEN_STARS.length;
  const dutyDoorIndex = (seed + 4) % QIMEN_DOORS.length;
  const earthStems = rotate(QIMEN_EARTH_STEMS, ju - 1);
  const heavenStems = rotate(QIMEN_EARTH_STEMS, (seed + ju) % QIMEN_EARTH_STEMS.length);
  const starOrder = rotate(QIMEN_STARS, chiefStarIndex);
  const doorOrder = rotate(QIMEN_DOORS, dutyDoorIndex);
  const deityOrder = rotate(QIMEN_DEITIES, dutyIndex % QIMEN_DEITIES.length);

  const palaces: QimenPalace[] = QIMEN_PALACE_LAYOUT.map((item, index) => {
    const isCenter = item.index === 5;

    return {
      ...item,
      earthStem: earthStems[index]!,
      heavenStem: heavenStems[index],
      star: starOrder[index],
      door: isCenter ? undefined : doorOrder[index % doorOrder.length],
      deity: isCenter ? "值符" : deityOrder[index % deityOrder.length],
      isDutyDoor: !isCenter && index % doorOrder.length === 0,
      isChiefStar: index === 0,
      isChiefDeity: isCenter || index % deityOrder.length === 0,
    };
  });

  const dutyPalace = palaces[dutyIndex]!;
  const favorablePalaces = palaces
    .filter((item) => item.door === "生门" || item.door === "开门" || item.door === "休门")
    .slice(0, 2)
    .map((item) => `${item.palace}(${item.direction})`);

  return {
    dun,
    dunLabel: dun === "yang" ? "阳遁" : "阴遁",
    ju,
    chiefDeity: "值符",
    chiefStar: palaces[0]?.star ?? "天蓬",
    dutyDoor: dutyPalace.door ?? "开门",
    dutyPalace: dutyPalace.palace,
    timeGanZhi: hour.getGanZhi(),
    dayGanZhi: lunar.getDayInGanZhiExact(),
    hourVoid: hour.getXunKong(),
    palaces,
    summary: [
      `${dun === "yang" ? "阳遁局更利于主动推进" : "阴遁局更适合收势布局"}，当前为${dun === "yang" ? "外放型" : "内敛型"}节奏。`,
      `值使落在${dutyPalace.palace}，宜先处理与${dutyPalace.direction}象意相近的事务与对象。`,
      favorablePalaces.length
        ? `当前较顺的门位集中在${favorablePalaces.join("、")}，适合优先从这些方向或议题切入。`
        : "本局没有明显顺手位，宜先求稳，再决定是否提速。",
    ],
  };
}

function getAdvice(chart: SanshiChart) {
  const favorable = chart.sectors.filter((item) => item.tone === "favorable");
  const cautious = chart.sectors.filter((item) => item.tone === "cautious");

  return [
    favorable.length
      ? `优先利用「${favorable[0]?.label}」这条线索推进，当前这部分阻力最小。`
      : "优先做信息整理和轻量试探，避免一上来把局势推得太满。",
    chart.meta.system === "qimen"
      ? `奇门这一局先看${chart.qimen?.dutyDoor ?? "值使"}所指的入口，再决定要不要加速推进。`
      : chart.meta.system === "taiyi"
        ? "太乙更看整体态势，先校正大方向，再决定局部动作。"
        : "六壬更看人与事的互动关系，关键在于谁先表态、谁先让步。",
    cautious.length
      ? `对「${cautious[0]?.label}」保持保守预案，别把它交给临场发挥。`
      : "风险面暂时不算突出，但仍建议保留一个可回撤方案。",
  ];
}

function getCaution(chart: SanshiChart) {
  const cautious = chart.sectors.filter((item) => item.tone === "cautious");

  if (cautious.length >= 2) {
    return [
      "本局不适合同时推进多条线，资源一分散，误判概率会明显上升。",
      "如果你已经被时间追着走，更要防止在焦虑里做出过度承诺。",
    ];
  }

  return [
    "关键节点请二次确认，尤其不要在信息不全时过度提速。",
    "若涉及重大签约、诉讼或高风险投资，先留出回撤空间，再决定是否继续推进。",
  ];
}

export function buildSanshiChart(input: SanshiInput): {
  chart: SanshiChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
} {
  const [year, month, day] = input.divinationDate.split("-").map(Number);
  const [hour, minute] = input.divinationTime.split(":").map(Number);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const dateTimeText = `${input.divinationDate} ${input.divinationTime}:00`;
  const ganZhi = `${lunar.getYearInGanZhiExact()}年 ${lunar.getMonthInGanZhiExact()}月 ${lunar.getDayInGanZhiExact()}日 ${lunar.getTimeInGanZhi()}时`;
  const xun = lunar.getTimeXun();
  const xunKong = lunar.getTimeXunKong();
  const seed = hashSeed(
    [
      input.system,
      input.topic,
      input.question,
      input.subjectName,
      input.divinationDate,
      input.divinationTime,
    ].join("|"),
  );
  const qimenBoard = input.system === "qimen" ? buildQimenBoard(input, lunar, seed) : undefined;

  const chart: SanshiChart = {
    kind: "sanshi",
    meta: {
      system: input.system,
      systemLabel: SYSTEM_LABELS[input.system],
      topic: input.topic,
      topicLabel: TOPIC_LABELS[input.topic],
      divinationDateTime: dateTimeText,
      lunar: lunar.toString(),
      ganZhi,
      xun,
      xunKong,
      question: input.question,
      subjectName: input.subjectName,
      gender: input.gender,
      notes: input.notes || undefined,
    },
    signals: [],
    sectors: getSectors(seed),
    qimen: qimenBoard,
    advice: [],
    caution: [],
    disclaimer: "",
  };

  chart.signals = getSignals(input, lunar, qimenBoard);
  chart.advice = getAdvice(chart);
  chart.caution = getCaution(chart);

  return {
    chart,
    birthGregorian: dateTimeText,
    birthLunar: {
      label: lunar.toString(),
      ganZhi,
      xun,
      xunKong,
      system: input.system,
      topic: input.topic,
      qimen: qimenBoard
        ? {
            dun: qimenBoard.dun,
            ju: qimenBoard.ju,
            dutyDoor: qimenBoard.dutyDoor,
            chiefStar: qimenBoard.chiefStar,
          }
        : undefined,
    },
  };
}
