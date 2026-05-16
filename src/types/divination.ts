export type DivinationType = "bazi" | "ziwei" | "qimen" | "meihua" | "custom";

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
    birthPlace?: string;
    timezone?: string;
    longitudeCorrectionMinutes?: number;
  };
  palaces: ZiweiPalace[];
}
