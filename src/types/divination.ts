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
  advice: string[];
  caution: string[];
  disclaimer: string;
}
