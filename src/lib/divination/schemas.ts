import { z } from "zod";

export const divinationInputSchema = z.object({
  divinationType: z.enum(["bazi", "ziwei"]),
  calendarType: z.enum(["solar", "lunar"]),
  birthDate: z.string().min(1),
  birthTime: z.string().min(1),
  isLeapMonth: z.coerce.boolean().optional().default(false),
  gender: z.enum(["male", "female", "other", "unknown"]),
  subjectName: z.string().trim().max(50).optional().default(""),
  question: z.string().trim().min(6).max(600),
});

export type DivinationInput = z.infer<typeof divinationInputSchema>;
