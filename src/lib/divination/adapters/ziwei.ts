import { astro } from "iztro";
import type { ZiweiChart } from "@/types/divination";
import type { DivinationInput } from "../schemas";
import { buildBaziChart } from "./bazi";
import { hourToZiWeiIndex } from "../normalize";

export function buildZiweiChart(input: DivinationInput): {
  chart: ZiweiChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
} {
  const bazi = buildBaziChart(input);
  const [datePart] = bazi.birthGregorian.split(" ");
  const hour = Number(input.birthTime.split(":")[0]);

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
        lunar: astrolabe.lunarDate,
        chineseDate: astrolabe.chineseDate,
        time: astrolabe.time,
        sign: astrolabe.sign,
        zodiac: astrolabe.zodiac,
        birthPlace: input.birthPlace || undefined,
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
    birthGregorian: bazi.birthGregorian,
    birthLunar: bazi.birthLunar,
  };
}
