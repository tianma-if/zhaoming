import type { BirthDivinationInput } from "./schemas";

export const TRUMP_SAMPLE_DIVINATION_KEY = "trump-bazi-sample";

export const TRUMP_SAMPLE_BAZI_INPUT: BirthDivinationInput = {
  divinationType: "bazi",
  calendarType: "solar",
  birthDate: "1946-06-14",
  birthTime: "10:54",
  birthPlace: "Queens, New York, United States",
  birthPlaceMeta: {
    label: "Queens, New York, United States",
    shortLabel: "Queens, New York",
    lat: "40.7282",
    lon: "-73.7949",
  },
  isLeapMonth: false,
  gender: "male",
  subjectName: "Donald Trump",
  question: "请给我一份整体八字命盘解读。",
};
