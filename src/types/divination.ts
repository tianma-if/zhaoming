export type DivinationType = "bazi" | "ziwei" | "qimen" | "meihua" | "chenggu" | "custom";

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
