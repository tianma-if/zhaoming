export const DIVINATION_PROMPT_INPUT_LABELS = {
  divinationType: "测算类型",
  question: "用户问题",
  gender: "性别",
  birthGregorian: "出生公历",
  chartJson: "排盘 JSON",
} as const;

export const DIVINATION_COMMON_CONSTRAINTS = [
  "避免恐吓式表达，不做医疗、法律、投资保证，不制造宿命论。",
  "结论要落在结构化命盘信息上，不要脱离输入数据自由发挥。",
];
