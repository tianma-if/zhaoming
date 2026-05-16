import { z } from "zod";

export const divinationInputSchema = z.object({
  divinationType: z.enum(["bazi", "ziwei"]),
  calendarType: z.enum(["solar", "lunar"]),
  birthDate: z.string().min(1),
  birthTime: z.string().min(1),
  birthPlace: z.string().trim().max(200).optional().default(""),
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
  subjectName: z.string().trim().max(50).optional().default(""),
  question: z.string().trim().min(6).max(600),
});

export type DivinationInput = z.infer<typeof divinationInputSchema>;
