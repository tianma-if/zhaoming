export type DivinationType =
  | "bazi"
  | "ziwei"
  | "qimen"
  | "meihua"
  | "liuyao"
  | "sanshi"
  | "chenggu"
  | "custom";

export interface BaziPillar {
  key: "year" | "month" | "day" | "time";
  label: string;
  ganZhi: string;
  heavenlyStem: string;
  earthlyBranch: string;
  hiddenStems: string[];
  naYin: string;
  wuXing: string;
  shiShenGan?: string;
  shiShenZhi?: string[];
}

export interface BaziChart {
  kind: "bazi";
  meta: {
    calendarType: "solar" | "lunar";
    solar: string;
    inputSolar?: string;
    lunar: string;
    zodiac: string;
    gender: string;
    question: string;
    birthPlace?: string;
    timezone?: string;
    longitudeCorrectionMinutes?: number;
  };
  pillars: BaziPillar[];
  derived: {
    taiYuan: string;
    taiXi: string;
    mingGong: string;
    shenGong: string;
  };
}

export interface ZiweiPalace {
  index: number;
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: string[];
  minorStars: string[];
  adjectiveStars: string[];
  changsheng12: string;
  isBodyPalace?: boolean;
  isOriginalPalace?: boolean;
  majorStarStates?: ZiweiStarState[];
  minorStarStates?: ZiweiStarState[];
  adjectiveStarStates?: ZiweiStarState[];
  boshi12?: string;
  jiangqian12?: string;
  suiqian12?: string;
  decadal?: ZiweiDecadal;
  ages?: number[];
  mutagens?: string[];
  mutagedPalaces?: (string | null)[];
}

export interface ZiweiStarState {
  name: string;
  brightness?: string;
}

export interface ZiweiDecadal {
  startAge: number;
  endAge: number;
  heavenlyStem: string;
  earthlyBranch: string;
}

export interface ZiweiFortuneScope {
  index: number;
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  palaceNames: string[];
  mutagenStars: string[];
  starsByPalace?: string[][];
  nominalAge?: number;
  yearlyJiangqian12?: string[];
  yearlySuiqian12?: string[];
}

export interface ZiweiFortunePalace {
  index: number;
  decadalPalaceName?: string;
  yearlyPalaceName?: string;
  agePalaceName?: string;
  decadalStars: string[];
  yearlyStars: string[];
  ageStars: string[];
  decadalMutagens: string[];
  yearlyMutagens: string[];
  ageMutagens: string[];
  yearlyJiangqian12?: string;
  yearlySuiqian12?: string;
  isDecadalFocus: boolean;
  isYearlyFocus: boolean;
  isAgeFocus: boolean;
}

export interface ZiweiFortune {
  targetDate: string;
  solarDate: string;
  lunarDate: string;
  nominalAge: number;
  decadal: ZiweiFortuneScope;
  yearly: ZiweiFortuneScope;
  age: ZiweiFortuneScope;
  palaces: ZiweiFortunePalace[];
}

export interface ZiweiChart {
  kind: "ziwei";
  meta: {
    solar: string;
    inputSolar?: string;
    lunar: string;
    chineseDate: string;
    time: string;
    sign: string;
    zodiac: string;
    gender?: string;
    soul?: string;
    body?: string;
    fiveElementsClass?: string;
    earthlyBranchOfSoulPalace?: string;
    earthlyBranchOfBodyPalace?: string;
    timeRange?: string;
    birthPlace?: string;
    timezone?: string;
    longitudeCorrectionMinutes?: number;
  };
  palaces: ZiweiPalace[];
  fortune?: ZiweiFortune;
}

export interface ChengguComponentWeight {
  key: "year" | "month" | "day" | "time";
  label: string;
  valueQian: number;
  display: string;
  source: string;
}

export interface ChengguChart {
  kind: "chenggu";
  meta: {
    calendarType: "solar" | "lunar";
    solar: string;
    inputSolar?: string;
    lunar: string;
    lunarYearGanZhi: string;
    lunarMonth: number;
    lunarDay: number;
    timeZhi: string;
    gender: string;
    question: string;
    birthPlace?: string;
    timezone?: string;
    longitudeCorrectionMinutes?: number;
  };
  weights: ChengguComponentWeight[];
  totalQian: number;
  totalText: string;
  verdict: string;
  summary: string;
}

export type LiuyaoLineValue = 6 | 7 | 8 | 9;

export interface LiuyaoLine {
  index: number;
  label: string;
  value: LiuyaoLineValue;
  yinYang: "yin" | "yang";
  isMoving: boolean;
  symbol: string;
  changedSymbol: string;
}

export interface LiuyaoHexagram {
  key: string;
  name: string;
  upperTrigram: string;
  lowerTrigram: string;
  lines: string[];
  description: string;
}

export interface LiuyaoChart {
  kind: "liuyao";
  meta: {
    method: "manual" | "coins";
    divinationDateTime: string;
    lunar: string;
    ganZhi: string;
    question: string;
    subjectName: string;
    gender: string;
    notes?: string;
  };
  lines: LiuyaoLine[];
  movingLineIndexes: number[];
  originalHexagram: LiuyaoHexagram;
  changedHexagram: LiuyaoHexagram;
}

export type SanshiSystem = "qimen" | "taiyi" | "liuren";
export type TaiyiCountType = "year" | "month" | "day" | "hour";

export type SanshiTopic =
  | "career"
  | "wealth"
  | "relationship"
  | "study"
  | "travel"
  | "lawsuit"
  | "health"
  | "general";

export interface SanshiSignal {
  label: string;
  value: string;
  hint?: string;
}

export interface SanshiSector {
  key: "timing" | "initiative" | "coordination" | "risk";
  label: string;
  tone: "favorable" | "neutral" | "cautious";
  summary: string;
  action: string;
}

export interface QimenPalace {
  index: number;
  row: number;
  col: number;
  palace: string;
  direction: string;
  earthStem: string;
  heavenStem?: string;
  door?: string;
  star?: string;
  deity?: string;
  isDutyDoor?: boolean;
  isChiefStar?: boolean;
  isChiefDeity?: boolean;
}

export interface QimenBoard {
  dun: "yin" | "yang";
  dunLabel: string;
  ju: number;
  chiefDeity: string;
  chiefStar: string;
  dutyDoor: string;
  dutyPalace: string;
  timeGanZhi: string;
  dayGanZhi: string;
  hourVoid: string;
  palaces: QimenPalace[];
  summary: string[];
}

export interface TaiyiPalace {
  index: number;
  row: number;
  col: number;
  palace: string;
  direction: string;
  trigraph: string;
  stage: "旺" | "平" | "守";
  markers: string[];
  summary: string;
}

export interface TaiyiGodSector {
  index: number;
  branch: string;
  palace: string;
  god: string;
  elementHint: string;
  markers: string[];
  summary: string;
}

export interface TaiyiBoard {
  countType: TaiyiCountType;
  countTypeLabel: string;
  countSource: string;
  countRuleSummary: string;
  bureau: number;
  epoch: "阳遁" | "阴遁";
  taiyiPalace: string;
  wenchangPalace: string;
  jishenPalace: string;
  shijiPalace: string;
  hostCount: number;
  guestCount: number;
  setCount: number;
  trend: "主强" | "客强" | "均衡";
  godSectors: TaiyiGodSector[];
  palaces: TaiyiPalace[];
  summary: string[];
}

export interface LiurenPalace {
  index: number;
  branch: string;
  palace: string;
  direction: string;
  heavenBranch: string;
  heavenGeneral: string;
  markers: string[];
  summary: string;
}

export interface LiurenLesson {
  label: "一课" | "二课" | "三课" | "四课";
  upper: string;
  lower: string;
  relation: string;
  hint: string;
}

export interface LiurenTransmission {
  label: "初传" | "中传" | "末传";
  branch: string;
  palace: string;
  heavenGeneral: string;
  summary: string;
}

export interface LiurenBoard {
  monthGeneral: string;
  monthGeneralPalace: string;
  timeLeader: string;
  timeLeaderPalace: string;
  dutyFocus: string;
  relationFocus: string;
  palaces: LiurenPalace[];
  lessons: LiurenLesson[];
  transmissions: LiurenTransmission[];
  summary: string[];
}

export interface SanshiChart {
  kind: "sanshi";
  meta: {
    system: SanshiSystem;
    systemLabel: string;
    topic: SanshiTopic;
    topicLabel: string;
    divinationDateTime: string;
    lunar: string;
    ganZhi: string;
    xun: string;
    xunKong: string;
    question: string;
    subjectName: string;
    gender: string;
    notes?: string;
  };
  signals: SanshiSignal[];
  sectors: SanshiSector[];
  qimen?: QimenBoard;
  taiyi?: TaiyiBoard;
  liuren?: LiurenBoard;
  advice: string[];
  caution: string[];
  disclaimer: string;
}
