import { astro } from "iztro";
import type { ZiweiChart } from "@/types/divination";
import type { DivinationInput } from "../schemas";
import { hourToZiWeiIndex } from "../normalize";
import { resolveBirthContext } from "../time-correction";

export function buildZiweiChart(input: DivinationInput): {
  chart: ZiweiChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
} {
  const { inputSolar, correctedSolar, timezone, longitudeCorrectionMinutes } =
    resolveBirthContext(input);
  const datePart = correctedSolar.toYmd();
  const hour = correctedSolar.getHour();

  const astrolabe =
    input.calendarType === "solar"
      ? astro.bySolar(
          datePart,
          hourToZiWeiIndex(hour),
          input.gender === "female" ? "女" : "男",
          true,
          "zh-CN",
        )
      : astro.byLunar(
          input.birthDate,
          hourToZiWeiIndex(hour),
          input.gender === "female" ? "女" : "男",
          input.isLeapMonth,
          true,
          "zh-CN",
        );

  return {
    chart: {
      kind: "ziwei",
      meta: {
        solar: astrolabe.solarDate,
        inputSolar: inputSolar.toYmdHms(),
        lunar: astrolabe.lunarDate,
        chineseDate: astrolabe.chineseDate,
        time: astrolabe.time,
        sign: astrolabe.sign,
        zodiac: astrolabe.zodiac,
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
      })),
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
