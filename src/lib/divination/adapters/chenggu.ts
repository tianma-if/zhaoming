import type { ChengguChart, ChengguComponentWeight } from "@/types/divination";
import type { DivinationInput } from "../schemas";
import { resolveBirthContext } from "../time-correction";

const YEAR_WEIGHT_MAP: Record<string, number> = {
  甲子: 12,
  乙丑: 9,
  丙寅: 6,
  丁卯: 7,
  戊辰: 12,
  己巳: 5,
  庚午: 9,
  辛未: 8,
  壬申: 7,
  癸酉: 8,
  甲戌: 15,
  乙亥: 9,
  丙子: 16,
  丁丑: 8,
  戊寅: 8,
  己卯: 19,
  庚辰: 12,
  辛巳: 6,
  壬午: 8,
  癸未: 7,
  甲申: 5,
  乙酉: 15,
  丙戌: 6,
  丁亥: 16,
  戊子: 15,
  己丑: 7,
  庚寅: 9,
  辛卯: 12,
  壬辰: 10,
  癸巳: 7,
  甲午: 15,
  乙未: 6,
  丙申: 5,
  丁酉: 14,
  戊戌: 14,
  己亥: 9,
  庚子: 7,
  辛丑: 7,
  壬寅: 9,
  癸卯: 12,
  甲辰: 8,
  乙巳: 7,
  丙午: 13,
  丁未: 5,
  戊申: 14,
  己酉: 5,
  庚戌: 9,
  辛亥: 17,
  壬子: 5,
  癸丑: 7,
  甲寅: 12,
  乙卯: 8,
  丙辰: 8,
  丁巳: 6,
  戊午: 19,
  己未: 6,
  庚申: 8,
  辛酉: 16,
  壬戌: 10,
  癸亥: 7,
};

const MONTH_WEIGHT_MAP: Record<number, number> = {
  1: 6,
  2: 7,
  3: 18,
  4: 9,
  5: 5,
  6: 16,
  7: 9,
  8: 15,
  9: 18,
  10: 8,
  11: 9,
  12: 5,
};

const DAY_WEIGHT_MAP: Record<number, number> = {
  1: 5,
  2: 10,
  3: 8,
  4: 15,
  5: 16,
  6: 15,
  7: 8,
  8: 16,
  9: 8,
  10: 16,
  11: 9,
  12: 17,
  13: 8,
  14: 17,
  15: 10,
  16: 8,
  17: 9,
  18: 18,
  19: 5,
  20: 15,
  21: 10,
  22: 9,
  23: 8,
  24: 9,
  25: 15,
  26: 18,
  27: 7,
  28: 8,
  29: 16,
  30: 6,
};

const TIME_WEIGHT_MAP: Record<string, number> = {
  子: 16,
  丑: 6,
  寅: 7,
  卯: 10,
  辰: 9,
  巳: 16,
  午: 10,
  未: 8,
  申: 8,
  酉: 9,
  戌: 6,
  亥: 6,
};

const VERDICT_MAP: Record<number, string> = {
  21: "短命非业谓大凶，平生灾难事重重，凶祸频临限逆境，终世困苦事不成",
  22: "身寒骨冷苦伶仃，此命推来行乞人，劳劳碌碌无度日，中年打拱过平生",
  23: "此命推来骨轻轻，求谋做事事难成，妻儿兄弟应难许，别处他乡作散人",
  24: "此命推来福禄无，门庭困苦总难荣，六亲骨肉皆无靠，流到他乡作老人",
  25: "此命推来祖业微，门庭营度似希奇，六亲骨肉如水炭，一世勤劳自把持",
  26: "平生一路苦中求，独自营谋事不休，离祖出门宜早计，晚来衣禄自无忧",
  27: "一生做事少商量，难靠祖宗作主张，独马单枪空作去，早年晚岁总无长",
  28: "一生作事似飘蓬，祖宗产业在梦中，若不过房并改姓，也当移徒二三通",
  29: "初年运限未曾亨，纵有功名在后成，须过四旬方可上，移居改姓使为良",
  30: "劳劳碌碌苦中求，东走西奔何日休，若能终身勤与俭，老来稍可免忧愁",
  31: "忙忙碌碌苦中求，何日云开见日头，难得祖基家可立，中年衣食渐无忧",
  32: "初年运错事难谋，渐有财源如水流，到的中年衣食旺，那时名利一齐来",
  33: "早年做事事难成，百计徒劳枉费心，半世自如流水去，后来运到始得金",
  34: "此命福气果如何，僧道门中衣禄多，离祖出家方得妙，终朝拜佛念弥陀",
  35: "生平福量不周全，祖业根基觉少传，营事生涯宜守旧，时来衣食胜从前",
  36: "不须劳碌过平生，独自成家福不轻，早有福星常照命，任君行去百般成",
  37: "此命般般事不成，弟兄少力自孤成，虽然祖业须微有，来的明时去的暗",
  38: "一生骨肉最清高，早入学门姓名标，待看年将三十六，蓝衣脱去换红袍",
  39: "此命终身运不通，劳劳做事尽皆空，苦心竭力成家计，到得那时在梦中",
  40: "平生衣禄是绵长，件件心中自主张，前面风霜都受过，从来必定享安泰",
  41: "此命推来事不同，为人能干异凡庸，中年还有逍遥福，不比前年云未通",
  42: "得宽怀处且宽怀，何用双眉总不开，若使中年命运济，那时名利一齐来",
  43: "为人心性最聪明，做事轩昂近贵人，衣禄一生天数定，不须劳碌是丰亨",
  44: "来事由天莫苦求，须知福禄胜前途，当年财帛难如意，晚景欣然便不忧",
  45: "福中取贵格求真，明敏才华志自伸，福禄寿全家道吉，桂兰毓秀晚荣臻",
  46: "东西南北尽皆通，出姓移名更觉隆，衣禄无亏天数定，中年晚景一般同",
  47: "此命推来旺末年，妻荣子贵自怡然，平生原有滔滔福，可有财源如水流",
  48: "幼年运道未曾享，苦是蹉跎再不兴，兄弟六亲皆无靠，一身事业晚年成",
  49: "此命推来福不轻，自立自成显门庭，从来富贵人亲近，使婢差奴过一生",
  50: "为利为名终日劳，中年福禄也多遭，老来是有财星照，不比前番目下高",
  51: "一世荣华事事通，不须劳碌自亨通，兄弟叔侄皆如意，家业成时福禄宏",
  52: "一世亨通事事能，不须劳思自然能，宗施欣然心皆好，家业丰亨自称心",
  53: "此格推来气象真，兴家发达在其中，一生福禄安排定，却是人间一富翁",
  54: "此命推来厚且清，诗书满腹看功成，丰衣足食自然稳，正是人间有福人",
  55: "走马扬鞭争名利，少年做事废筹论，一朝福禄源源至，富贵荣华显六亲",
  56: "此格推来礼仪通，一生福禄用无穷，甜酸苦辣皆尝过，财源滚滚稳且丰",
  57: "福禄盈盈万事全，一生荣耀显双亲，名扬威震人钦敬，处世逍遥似遇春",
  58: "平生福禄自然来，名利兼全福禄偕，雁塔提名为贵客，紫袍金带走金鞋",
  59: "细推此格妙且清，必定才高礼仪通，甲第之中应有分，扬鞭走马显威荣",
  60: "一朝金榜快题名，显祖荣宗立大功，衣食定然原欲足，田园财帛更丰盈",
  61: "不做朝中金榜客，定为世上一财翁，聪明天赋经书熟，名显高科自是荣",
  62: "此名生来福不穷，读书必定显亲荣，紫衣金带为卿相，富贵荣华皆可同",
  63: "命主为官福禄长，得来富贵定非常，名题金塔传金榜，定中高科天下扬",
  64: "此格权威不可当，紫袍金带坐高堂，荣华富贵谁能及，积玉堆金满储仓",
  65: "细推此命福不轻，安国安邦极品人，文绣雕梁政富贵，威声照耀四方闻",
  66: "此格人间一福人，堆金积玉满堂春，从来富贵由天定，正笏垂绅谒圣君",
  67: "此名生来福自宏，田园家业最高隆，平生衣禄丰盈足，一世荣华万事通",
  68: "富贵由天莫苦求，万金家计不须谋，十年不比前番事，祖业根基水上舟",
  69: "君是人间衣禄星，一生福贵众人钦，纵然福禄由天定，安享荣华过一生",
  70: "此命推来福不轻，不须愁虑苦劳心，一生天定衣与禄，富贵荣华过一生",
  71: "此命生来大不同，公侯卿相在其中，一生自有逍遥福，富贵荣华极品隆",
  72: "此格世界罕有生，十代积善产此人，天上紫微来照命，统治万民乐太平",
};

function formatWeight(valueQian: number) {
  const liang = Math.floor(valueQian / 10);
  const qian = valueQian % 10;

  if (liang === 0) {
    return `${qian}钱`;
  }

  if (qian === 0) {
    return `${liang}两`;
  }

  return `${liang}两${qian}钱`;
}

function buildWeight(
  key: ChengguComponentWeight["key"],
  label: string,
  source: string,
  valueQian: number,
): ChengguComponentWeight {
  return {
    key,
    label,
    source,
    valueQian,
    display: formatWeight(valueQian),
  };
}

function summarizeWeight(totalQian: number) {
  if (totalQian <= 39) {
    return "骨重偏轻，整体更像先难后易的节奏，通常要靠个人积累、环境切换与时间换空间。";
  }

  if (totalQian <= 54) {
    return "骨重居中，命势强调稳步经营与中后段起势，更适合用耐心把优势慢慢做厚。";
  }

  return "骨重偏高，传统称骨里多被视作福禄较盛，但也更强调格局、责任与自我节制。";
}

export function buildChengguChart(input: DivinationInput): {
  chart: ChengguChart;
  birthGregorian: string;
  birthLunar: Record<string, unknown>;
} {
  const { inputSolar, correctedSolar, timezone, longitudeCorrectionMinutes } =
    resolveBirthContext(input);
  const lunar = correctedSolar.getLunar();
  const yearGanZhi = lunar.getYearInGanZhiExact();
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();
  const timeZhi = lunar.getTimeZhi();

  const yearWeight = YEAR_WEIGHT_MAP[yearGanZhi];
  const monthWeight = MONTH_WEIGHT_MAP[lunarMonth];
  const dayWeight = DAY_WEIGHT_MAP[lunarDay];
  const timeWeight = TIME_WEIGHT_MAP[timeZhi];

  if (!yearWeight || !monthWeight || !dayWeight || !timeWeight) {
    throw new Error("称骨算命数据计算失败，请检查出生信息。");
  }

  const weights = [
    buildWeight("year", "年骨重", `${yearGanZhi}年`, yearWeight),
    buildWeight("month", "月骨重", `农历${lunarMonth}月`, monthWeight),
    buildWeight("day", "日骨重", `农历${lunarDay}日`, dayWeight),
    buildWeight("time", "时骨重", `${timeZhi}时`, timeWeight),
  ];
  const totalQian = weights.reduce((sum, item) => sum + item.valueQian, 0);
  const verdict = VERDICT_MAP[totalQian] ?? "暂无对应歌诀";

  return {
    chart: {
      kind: "chenggu",
      meta: {
        calendarType: input.calendarType,
        solar: correctedSolar.toYmdHms(),
        inputSolar: inputSolar.toYmdHms(),
        lunar: lunar.toString(),
        lunarYearGanZhi: yearGanZhi,
        lunarMonth,
        lunarDay,
        timeZhi,
        gender: input.gender,
        question: input.question,
        birthPlace: input.birthPlace || undefined,
        timezone: timezone || undefined,
        longitudeCorrectionMinutes,
      },
      weights,
      totalQian,
      totalText: formatWeight(totalQian),
      verdict,
      summary: summarizeWeight(totalQian),
    },
    birthGregorian: correctedSolar.toYmdHms(),
    birthLunar: {
      label: lunar.toString(),
      yearGanZhi,
      month: lunarMonth,
      day: lunarDay,
      timeZhi,
      isLeapMonth: input.isLeapMonth,
      timezone: timezone || undefined,
      longitudeCorrectionMinutes,
      inputSolar: inputSolar.toYmdHms(),
      correctedSolar: correctedSolar.toYmdHms(),
    },
  };
}
