import { z } from "zod";

export const divinationInputSchema = z.object({
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

export type DivinationInputForm = z.input<typeof divinationInputSchema>;
export type DivinationInput = z.output<typeof divinationInputSchema>;
