import { Solar } from "lunar-typescript";
import type {
  QimenBoard,
  QimenPalace,
  SanshiChart,
  SanshiSector,
  SanshiSignal,
  SanshiSystem,
  SanshiTopic,
  TaiyiBoard,
  TaiyiCountType,
  TaiyiGodSector,
  TaiyiPalace,
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
const TAIYI_COUNT_TYPE_LABELS: Record<TaiyiCountType, string> = {
  year: "年计",
  month: "月计",
  day: "日计",
  hour: "时计",
};
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

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
const TAIYI_NINE_LAYOUT = [
  { index: 9, row: 1, col: 1, palace: "巽九宫", direction: "东南", trigraph: "巽" },
  { index: 2, row: 1, col: 2, palace: "离二宫", direction: "正南", trigraph: "离" },
  { index: 7, row: 1, col: 3, palace: "坤七宫", direction: "西南", trigraph: "坤" },
  { index: 4, row: 2, col: 1, palace: "震四宫", direction: "正东", trigraph: "震" },
  { index: 5, row: 2, col: 2, palace: "中五宫", direction: "中宫", trigraph: "中" },
  { index: 6, row: 2, col: 3, palace: "兑六宫", direction: "正西", trigraph: "兑" },
  { index: 3, row: 3, col: 1, palace: "艮三宫", direction: "东北", trigraph: "艮" },
  { index: 8, row: 3, col: 2, palace: "坎八宫", direction: "正北", trigraph: "坎" },
  { index: 1, row: 3, col: 3, palace: "乾一宫", direction: "西北", trigraph: "乾" },
] as const;

const QIMEN_EARTH_STEMS = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"] as const;
const QIMEN_DOORS = ["休门", "生门", "伤门", "杜门", "景门", "死门", "惊门", "开门"] as const;
const QIMEN_STARS = ["天蓬", "天任", "天冲", "天辅", "天英", "天芮", "天柱", "天心", "天禽"] as const;
const QIMEN_DEITIES = ["值符", "螣蛇", "太阴", "六合", "白虎", "玄武", "九地", "九天"] as const;
const TAIYI_MARKERS = ["太乙", "文昌", "计神", "始击", "主算", "客算", "定算"] as const;
const TAIYI_SIXTEEN_PALACES = [
  { branch: "子", palace: "子宫", god: "地主", elementHint: "根基与内盘" },
  { branch: "丑", palace: "丑宫", god: "阳德", elementHint: "助力与德泽" },
  { branch: "艮", palace: "艮宫", god: "和德", elementHint: "协调与缓冲" },
  { branch: "寅", palace: "寅宫", god: "吕申", elementHint: "起势与扩张" },
  { branch: "卯", palace: "卯宫", god: "高丛", elementHint: "抬升与显露" },
  { branch: "辰", palace: "辰宫", god: "太阳", elementHint: "外放与执行" },
  { branch: "巽", palace: "巽宫", god: "大炅", elementHint: "渗透与传播" },
  { branch: "巳", palace: "巳宫", god: "大神", elementHint: "聚势与临门" },
  { branch: "午", palace: "午宫", god: "大威", elementHint: "压力与权柄" },
  { branch: "未", palace: "未宫", god: "天道", elementHint: "规则与秩序" },
  { branch: "坤", palace: "坤宫", god: "大武", elementHint: "守成与承载" },
  { branch: "申", palace: "申宫", god: "武德", elementHint: "策略与军令" },
  { branch: "酉", palace: "酉宫", god: "太簇", elementHint: "收束与定调" },
  { branch: "戌", palace: "戌宫", god: "阴主", elementHint: "暗线与制衡" },
  { branch: "乾", palace: "乾宫", god: "阴德", elementHint: "潜助与贵援" },
  { branch: "亥", palace: "亥宫", god: "大义", elementHint: "收官与取舍" },
] as const;
const TAIYI_STAGE_SUMMARIES = {
  旺: [
    "此宫气势外放，适合作为主动作业的切入点。",
    "这里更容易接到反馈，适合先表态、先试探。",
  ],
  平: [
    "此宫偏向过渡，适合作为协同、观察与校正位置。",
    "这里不宜过度加码，更适合稳节奏、留余地。",
  ],
  守: [
    "此宫宜守不宜冲，适合先查漏、先防风险。",
    "这里阻力偏显，若要推进需先补条件。",
  ],
} as const;
const TAIYI_GOD_SUMMARIES = [
  "此位更适合观察来势与外部压力，不宜盲目抢跑。",
  "这一路更像真正的作用点，适合把资源放在关键动作上。",
  "这里体现的是暗线影响，适合做校正、缓冲或预案。",
] as const;

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

function getSignals(
  input: SanshiInput,
  lunar: ReturnType<Solar["getLunar"]>,
  qimenBoard?: QimenBoard,
  taiyiBoard?: TaiyiBoard,
): SanshiSignal[] {
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
      : taiyiBoard
        ? [
            {
              label: "太乙文昌",
              value: `${taiyiBoard.taiyiPalace} / ${taiyiBoard.wenchangPalace}`,
              hint: `十六宫主轴见${taiyiBoard.godSectors.find((item) => item.markers.includes("太乙"))?.palace ?? "未知"} / ${taiyiBoard.godSectors.find((item) => item.markers.includes("文昌"))?.palace ?? "未知"}`,
            },
            {
              label: "所用计法",
              value: taiyiBoard.countTypeLabel,
            },
            {
              label: "计神始击",
              value: `${taiyiBoard.jishenPalace} / ${taiyiBoard.shijiPalace}`,
              hint: "始击由计神经和德(艮宫)校位后推出",
            },
            {
              label: "主客定算",
              value: `${taiyiBoard.hostCount} / ${taiyiBoard.guestCount} / ${taiyiBoard.setCount}`,
              hint:
                taiyiBoard.trend === "主强"
                  ? "主势略占先手"
                  : taiyiBoard.trend === "客强"
                    ? "客势更有压迫感"
                    : "主客暂时均衡",
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

function getTaiyiEpoch(month: number): TaiyiBoard["epoch"] {
  return month >= 5 && month <= 10 ? "阴遁" : "阳遁";
}

function getBranchIndex(ganzhi: string) {
  const branch = ganzhi.trim().slice(-1);
  const index = EARTHLY_BRANCHES.indexOf(branch as (typeof EARTHLY_BRANCHES)[number]);

  return index >= 0 ? index : 0;
}

function getTaiyiCountContext(
  countType: TaiyiCountType,
  lunar: ReturnType<Solar["getLunar"]>,
) {
  if (countType === "year") {
    const source = lunar.getYearInGanZhiExact();
    return {
      source,
      value: getBranchIndex(source),
      ruleSummary: "以年支为计神起点，更偏长期大势与年度气运。",
    };
  }

  if (countType === "month") {
    const source = lunar.getMonthInGanZhiExact();
    return {
      source,
      value: getBranchIndex(source),
      ruleSummary: "以月支为计神起点，更偏阶段推进与月内节奏。",
    };
  }

  if (countType === "day") {
    const source = lunar.getDayInGanZhiExact();
    return {
      source,
      value: getBranchIndex(source),
      ruleSummary: "以日支为计神起点，更偏近日局面与短线判断。",
    };
  }

  const source = lunar.getTimeInGanZhi();
  return {
    source,
    value: getBranchIndex(source),
    ruleSummary: "以时支为计神起点，更偏当下窗口与即时动作。",
  };
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

function getTaiyiStage(seed: number, index: number): TaiyiPalace["stage"] {
  const value = (seed + index * 5) % 9;

  if (value <= 2) return "旺";
  if (value <= 5) return "平";
  return "守";
}

function buildTaiyiBoard(
  input: SanshiInput,
  lunar: ReturnType<Solar["getLunar"]>,
  seed: number,
): TaiyiBoard {
  const month = lunar.getMonth();
  const day = lunar.getDay();
  const hour = lunar.getTime();
  const countType = input.taiyiCountType ?? "hour";
  const countContext = getTaiyiCountContext(countType, lunar);
  const countBase = countContext.value;
  const epoch = getTaiyiEpoch(month);
  const bureau = ((month * 9 + day + hour.getZhiIndex() + countBase + seed) % 72) + 1;
  const taiyiIndex = (seed + month + day + countBase) % TAIYI_NINE_LAYOUT.length;
  const wenchangShift = countType === "year" ? 3 : countType === "month" ? 2 : countType === "day" ? 1 : 0;
  const wenchangIndex = (taiyiIndex + 2 + hour.getZhiIndex() + wenchangShift) % TAIYI_NINE_LAYOUT.length;
  const hostCount = ((seed % 24) + month + day + countBase) % 40 + 12;
  const guestCount = ((seed % 17) + hour.getZhiIndex() * 2 + day + wenchangShift) % 40 + 12;
  const setCount = Math.max(1, Math.min(72, Math.round((hostCount + guestCount) / 2 + ((seed % 7) - 3))));
  const trend: TaiyiBoard["trend"] =
    Math.abs(hostCount - guestCount) <= 3 ? "均衡" : hostCount > guestCount ? "主强" : "客强";
  const jishenGodIndex = (seed + countBase + bureau) % TAIYI_SIXTEEN_PALACES.length;
  const hedeGodIndex = TAIYI_SIXTEEN_PALACES.findIndex((item) => item.branch === "艮");
  const shiftToHede = (hedeGodIndex - jishenGodIndex + TAIYI_SIXTEEN_PALACES.length) % TAIYI_SIXTEEN_PALACES.length;
  const taiyiGodIndex = (seed + bureau) % TAIYI_SIXTEEN_PALACES.length;
  const wenchangGodIndex = (taiyiGodIndex + 3 + hour.getZhiIndex()) % TAIYI_SIXTEEN_PALACES.length;
  const shijiGodIndex = (wenchangGodIndex + shiftToHede) % TAIYI_SIXTEEN_PALACES.length;
  const jishenIndex = (seed + countBase + bureau) % TAIYI_NINE_LAYOUT.length;
  const shijiIndex = (wenchangIndex + (shiftToHede % TAIYI_NINE_LAYOUT.length)) % TAIYI_NINE_LAYOUT.length;
  const hostPalaceIndex = (taiyiIndex + (hostCount % 3) + 1) % TAIYI_NINE_LAYOUT.length;
  const guestPalaceIndex = (shijiIndex + (guestCount % 3) + 1) % TAIYI_NINE_LAYOUT.length;
  const setPalaceIndex = (wenchangIndex + (setCount % 3) + 1) % TAIYI_NINE_LAYOUT.length;
  const hostGodIndex = (taiyiGodIndex + (hostCount % 5) + 1) % TAIYI_SIXTEEN_PALACES.length;
  const guestGodIndex = (shijiGodIndex + (guestCount % 5) + 1) % TAIYI_SIXTEEN_PALACES.length;
  const setGodIndex = (wenchangGodIndex + (setCount % 5) + 1) % TAIYI_SIXTEEN_PALACES.length;

  const godSectors: TaiyiGodSector[] = TAIYI_SIXTEEN_PALACES.map((item, index) => ({
    index: index + 1,
    branch: item.branch,
    palace: item.palace,
    god: item.god,
    elementHint: item.elementHint,
    markers: TAIYI_MARKERS.filter((marker) => {
      if (marker === "太乙") return index === taiyiGodIndex;
      if (marker === "文昌") return index === wenchangGodIndex;
      if (marker === "计神") return index === jishenGodIndex;
      if (marker === "始击") return index === shijiGodIndex;
      if (marker === "主算") return index === hostGodIndex;
      if (marker === "客算") return index === guestGodIndex;
      return index === setGodIndex;
    }),
    summary: pickBySeed(TAIYI_GOD_SUMMARIES, seed, index),
  }));

  const palaces: TaiyiPalace[] = TAIYI_NINE_LAYOUT.map((item, index) => {
    const markers = TAIYI_MARKERS.filter((marker) => {
      if (marker === "太乙") return index === taiyiIndex;
      if (marker === "文昌") return index === wenchangIndex;
      if (marker === "计神") return index === jishenIndex;
      if (marker === "始击") return index === shijiIndex;
      if (marker === "主算") return index === hostPalaceIndex;
      if (marker === "客算") return index === guestPalaceIndex;
      return index === setPalaceIndex;
    });
    const stage = getTaiyiStage(seed, index);

    return {
      index: item.index,
      row: item.row,
      col: item.col,
      palace: item.palace,
      direction: item.direction,
      trigraph: item.trigraph,
      stage,
      markers,
      summary: pickBySeed(TAIYI_STAGE_SUMMARIES[stage], seed, index),
    };
  });

  const taiyiPalace = palaces[taiyiIndex]!;
  const wenchangPalace = palaces[wenchangIndex]!;
  const jishenPalace = palaces[jishenIndex]!;
  const shijiPalace = palaces[shijiIndex]!;

  return {
    countType,
    countTypeLabel: TAIYI_COUNT_TYPE_LABELS[countType],
    countSource: countContext.source,
    countRuleSummary: countContext.ruleSummary,
    bureau,
    epoch,
    taiyiPalace: taiyiPalace.palace,
    wenchangPalace: wenchangPalace.palace,
    jishenPalace: jishenPalace.palace,
    shijiPalace: shijiPalace.palace,
    hostCount,
    guestCount,
    setCount,
    trend,
    godSectors,
    palaces,
    summary: [
      `${epoch}第${bureau}局，当前呈「${trend}」态势，适合先看大方向是否站得住，再决定局部动作。`,
      `十六宫里太乙临${godSectors[taiyiGodIndex]?.palace}、文昌临${godSectors[wenchangGodIndex]?.palace}；九宫里太乙落${taiyiPalace.palace}，可对照判断外层神机与内层落点是否一致。`,
      `计神取${godSectors[jishenGodIndex]?.palace}，再以和德(艮宫)校位推始击；始击临${shijiPalace.palace}，表示真正的发力口与冲突点。`,
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
  const taiyiBoard = input.system === "taiyi" ? buildTaiyiBoard(input, lunar, seed) : undefined;

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
    taiyi: taiyiBoard,
    advice: [],
    caution: [],
    disclaimer: "",
  };

  chart.signals = getSignals(input, lunar, qimenBoard, taiyiBoard);
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
      taiyi: taiyiBoard
        ? {
            countType: taiyiBoard.countType,
            countTypeLabel: taiyiBoard.countTypeLabel,
            countSource: taiyiBoard.countSource,
            countRuleSummary: taiyiBoard.countRuleSummary,
            bureau: taiyiBoard.bureau,
            epoch: taiyiBoard.epoch,
            taiyiPalace: taiyiBoard.taiyiPalace,
            wenchangPalace: taiyiBoard.wenchangPalace,
            jishenPalace: taiyiBoard.jishenPalace,
            shijiPalace: taiyiBoard.shijiPalace,
            trend: taiyiBoard.trend,
          }
        : undefined,
    },
  };
}
