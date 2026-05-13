import { NextResponse } from "next/server";
import { canConsumeCredits, reserveDivinationCredits } from "@/lib/billing/credits";
import { auth } from "@/lib/auth";
import { buildBaziChart } from "@/lib/divination/adapters/bazi";
import { buildZiweiChart } from "@/lib/divination/adapters/ziwei";
import { divinationInputSchema } from "@/lib/divination/schemas";
import { ensureUserProfile, getUserProfile, insertDivination } from "@/lib/data";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const user = session?.user ?? null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserProfile(user);

  const parsed = divinationInputSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const profile = await getUserProfile(user.id);
  const permission = canConsumeCredits(profile);

  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 402 });
  }

  const { chart, birthGregorian, birthLunar } =
    parsed.data.divinationType === "bazi"
      ? buildBaziChart(parsed.data)
      : buildZiweiChart(parsed.data);

  await reserveDivinationCredits();

  const data = await insertDivination({
    userId: user.id,
    divinationType: parsed.data.divinationType,
    subjectName: parsed.data.subjectName || null,
    birthGregorian,
    birthLunar,
    gender: parsed.data.gender,
    question: parsed.data.question,
    inputParams: parsed.data,
    chartJson: chart,
  });

  return NextResponse.json({ divination: data });
}
