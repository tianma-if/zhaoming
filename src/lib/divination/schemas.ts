import { z } from "zod";

export const birthDivinationInputSchema = z.object({
  divinationType: z.enum(["bazi", "ziwei", "chenggu"]),
  calendarType: z.enum(["solar", "lunar"]),
  birthDate: z.string().min(1, "请选择出生日期。"),
  birthTime: z.string().min(1, "请选择出生时辰。"),
  birthPlace: z.string().trim().max(200, "出生地点不能超过 200 个字符。").optional().default(""),
  birthPlaceMeta: z
    .object({
      label: z.string(),
      shortLabel: z.string(),
      lat: z.string(),
      lon: z.string(),
    })
    .nullable()
    .optional()
    .default(null),
  isLeapMonth: z.coerce.boolean().optional().default(false),
  gender: z.enum(["male", "female", "other", "unknown"]),
  subjectName: z.string().trim().min(1, "请输入姓名。").max(50, "姓名不能超过 50 个字符。"),
  question: z.string().trim().min(6, "问题至少 6 个字符。").max(600, "问题不能超过 600 个字符。"),
});

const liuyaoLineSchema = z.coerce
  .number()
  .int()
  .refine((value) => [6, 7, 8, 9].includes(value), "爻值必须是 6、7、8、9。");

export const liuyaoInputSchema = z.object({
  divinationType: z.literal("liuyao"),
  subjectName: z.string().trim().min(1, "请输入求测人姓名。").max(50, "姓名不能超过 50 个字符。"),
  gender: z.enum(["male", "female", "other", "unknown"]).default("unknown"),
  question: z.string().trim().min(6, "问题至少 6 个字符。").max(600, "问题不能超过 600 个字符。"),
  divinationDate: z.string().min(1, "请选择起卦日期。"),
  divinationTime: z.string().min(1, "请选择起卦时间。"),
  method: z.enum(["manual", "coins"]),
  lineValues: z.array(liuyaoLineSchema).length(6, "请完整填写六爻。"),
  notes: z.string().trim().max(300, "补充信息不能超过 300 个字符。").optional().default(""),
});

export const sanshiInputSchema = z.object({
  divinationType: z.literal("sanshi"),
  system: z.enum(["qimen", "taiyi", "liuren"]),
  subjectName: z.string().trim().min(1, "请输入求测人姓名。").max(50, "姓名不能超过 50 个字符。"),
  gender: z.enum(["male", "female", "other", "unknown"]).default("unknown"),
  question: z.string().trim().min(6, "问题至少 6 个字符。").max(600, "问题不能超过 600 个字符。"),
  divinationDate: z.string().min(1, "请选择起局日期。"),
  divinationTime: z.string().min(1, "请选择起局时间。"),
  topic: z.enum(["career", "wealth", "relationship", "study", "travel", "lawsuit", "health", "general"]),
  notes: z.string().trim().max(300, "补充信息不能超过 300 个字符。").optional().default(""),
});

export const divinationInputSchema = z.discriminatedUnion("divinationType", [
  birthDivinationInputSchema,
  liuyaoInputSchema,
  sanshiInputSchema,
]);

export type BirthDivinationInputForm = z.input<typeof birthDivinationInputSchema>;
export type BirthDivinationInput = z.output<typeof birthDivinationInputSchema>;
export type LiuyaoInputForm = z.input<typeof liuyaoInputSchema>;
export type LiuyaoInput = z.output<typeof liuyaoInputSchema>;
export type SanshiInputForm = z.input<typeof sanshiInputSchema>;
export type SanshiInput = z.output<typeof sanshiInputSchema>;
export type DivinationInputForm = z.input<typeof divinationInputSchema>;
export type DivinationInput = z.output<typeof divinationInputSchema>;
