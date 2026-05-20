import { astro } from "iztro";
import type { ZiweiChart } from "@/types/divination";
import type { DivinationInput } from "../schemas";
import { hourToZiWeiIndex } from "../normalize";
import { resolveBirthContext } from "../time-correction";

const ZIWEI_MUTAGENS = ["禄", "权", "科", "忌"] as const;

function formatShanghaiDate(input: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(input);
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export function buildZiweiChart(input: DivinationInput): {
  chart: ZiweiChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
}
export function buildZiweiChart(
  input: DivinationInput,
  options?: {
    fortuneDate?: Date | string;
  },
): {
  chart: ZiweiChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
} {
  const { inputSolar, correctedSolar, timezone, longitudeCorrectionMinutes } =
    resolveBirthContext(input);
  const datePart = correctedSolar.toYmd();
  const hour = correctedSolar.getHour();
  const timeIndex = hourToZiWeiIndex(hour);
  const fortuneDate =
    typeof options?.fortuneDate === "string"
      ? options.fortuneDate
      : formatShanghaiDate(options?.fortuneDate ?? new Date());

  const astrolabe =
    input.calendarType === "solar"
      ? astro.bySolar(
          datePart,
          timeIndex,
          input.gender === "female" ? "女" : "男",
          true,
          "zh-CN",
        )
      : astro.byLunar(
          input.birthDate,
          timeIndex,
          input.gender === "female" ? "女" : "男",
          input.isLeapMonth,
          true,
          "zh-CN",
        );
  const horoscope = astrolabe.horoscope(fortuneDate, timeIndex);

  return {
    chart: {
      kind: "ziwei",
      meta: {
        solar: astrolabe.solarDate,
        inputSolar: inputSolar.toYmdHms(),
        lunar: astrolabe.lunarDate,
        chineseDate: astrolabe.chineseDate,
        time: astrolabe.time,
        timeRange: astrolabe.timeRange,
        sign: astrolabe.sign,
        zodiac: astrolabe.zodiac,
        gender: input.gender,
        soul: astrolabe.soul,
        body: astrolabe.body,
        fiveElementsClass: astrolabe.fiveElementsClass,
        earthlyBranchOfSoulPalace: astrolabe.earthlyBranchOfSoulPalace,
        earthlyBranchOfBodyPalace: astrolabe.earthlyBranchOfBodyPalace,
        birthPlace: input.birthPlace || undefined,
        timezone: timezone || undefined,
        longitudeCorrectionMinutes,
      },
      palaces: astrolabe.palaces.map((palace) => ({
        index: palace.index,
        name: palace.name,
        heavenlyStem: palace.heavenlyStem,
        earthlyBranch: palace.earthlyBranch,
        majorStars: palace.majorStars.map((item) => item.name),
        minorStars: palace.minorStars.map((item) => item.name),
        adjectiveStars: palace.adjectiveStars.map((item) => item.name),
        changsheng12: palace.changsheng12,
        isBodyPalace: palace.isBodyPalace,
        isOriginalPalace: palace.isOriginalPalace,
        majorStarStates: palace.majorStars.map((item) => ({
          name: item.name,
          brightness: item.brightness,
        })),
        minorStarStates: palace.minorStars.map((item) => ({
          name: item.name,
          brightness: item.brightness,
        })),
        adjectiveStarStates: palace.adjectiveStars.map((item) => ({
          name: item.name,
          brightness: item.brightness,
        })),
        boshi12: palace.boshi12,
        jiangqian12: palace.jiangqian12,
        suiqian12: palace.suiqian12,
        decadal: {
          startAge: palace.decadal.range[0],
          endAge: palace.decadal.range[1],
          heavenlyStem: palace.decadal.heavenlyStem,
          earthlyBranch: palace.decadal.earthlyBranch,
        },
        ages: palace.ages,
        mutagens: ZIWEI_MUTAGENS.filter((mutagen) => palace.hasMutagen(mutagen)),
        mutagedPalaces: palace.mutagedPlaces().map((item) => item?.name ?? null),
      })),
      fortune: {
        targetDate: fortuneDate,
        solarDate: horoscope.solarDate,
        lunarDate: horoscope.lunarDate,
        nominalAge: horoscope.age.nominalAge,
        decadal: {
          index: horoscope.decadal.index,
          name: horoscope.decadal.name,
          heavenlyStem: horoscope.decadal.heavenlyStem,
          earthlyBranch: horoscope.decadal.earthlyBranch,
          palaceNames: horoscope.decadal.palaceNames,
          mutagenStars: horoscope.decadal.mutagen,
          starsByPalace: horoscope.decadal.stars?.map((group) => group.map((item) => item.name)),
        },
        yearly: {
          index: horoscope.yearly.index,
          name: horoscope.yearly.name,
          heavenlyStem: horoscope.yearly.heavenlyStem,
          earthlyBranch: horoscope.yearly.earthlyBranch,
          palaceNames: horoscope.yearly.palaceNames,
          mutagenStars: horoscope.yearly.mutagen,
          starsByPalace: horoscope.yearly.stars?.map((group) => group.map((item) => item.name)),
          yearlyJiangqian12: horoscope.yearly.yearlyDecStar.jiangqian12,
          yearlySuiqian12: horoscope.yearly.yearlyDecStar.suiqian12,
        },
        age: {
          index: horoscope.age.index,
          name: horoscope.age.name,
          heavenlyStem: horoscope.age.heavenlyStem,
          earthlyBranch: horoscope.age.earthlyBranch,
          palaceNames: horoscope.age.palaceNames,
          mutagenStars: horoscope.age.mutagen,
          starsByPalace: horoscope.age.stars?.map((group) => group.map((item) => item.name)),
          nominalAge: horoscope.age.nominalAge,
        },
        palaces: astrolabe.palaces.map((palace, index) => ({
          index: palace.index,
          decadalPalaceName: horoscope.decadal.palaceNames[index],
          yearlyPalaceName: horoscope.yearly.palaceNames[index],
          agePalaceName: horoscope.age.palaceNames[index],
          decadalStars: horoscope.decadal.stars?.[index]?.map((item) => item.name) ?? [],
          yearlyStars: horoscope.yearly.stars?.[index]?.map((item) => item.name) ?? [],
          ageStars: horoscope.age.stars?.[index]?.map((item) => item.name) ?? [],
          decadalMutagens: ZIWEI_MUTAGENS.filter((mutagen) =>
            horoscope.hasHoroscopeMutagen(palace.name, "decadal", mutagen),
          ),
          yearlyMutagens: ZIWEI_MUTAGENS.filter((mutagen) =>
            horoscope.hasHoroscopeMutagen(palace.name, "yearly", mutagen),
          ),
          ageMutagens: [],
          yearlyJiangqian12: horoscope.yearly.yearlyDecStar.jiangqian12[index],
          yearlySuiqian12: horoscope.yearly.yearlyDecStar.suiqian12[index],
          isDecadalFocus: horoscope.decadal.index === palace.index,
          isYearlyFocus: horoscope.yearly.index === palace.index,
          isAgeFocus: horoscope.age.index === palace.index,
        })),
      },
    },
    birthGregorian: correctedSolar.toYmdHms(),
    birthLunar: {
      timezone: timezone || undefined,
      longitudeCorrectionMinutes,
      inputSolar: inputSolar.toYmdHms(),
      correctedSolar: correctedSolar.toYmdHms(),
    },
  };
}
