import { NextResponse } from "next/server";
import { canConsumeCredits, reserveDivinationCredits } from "@/lib/billing/credits";
import { auth } from "@/lib/auth";
import { buildBaziChart } from "@/lib/divination/adapters/bazi";
import { buildChengguChart } from "@/lib/divination/adapters/chenggu";
import { buildLiuyaoChart } from "@/lib/divination/adapters/liuyao";
import { buildMeihuaChart } from "@/lib/divination/adapters/meihua";
import { buildSanshiChart } from "@/lib/divination/adapters/sanshi";
import { buildZiweiChart } from "@/lib/divination/adapters/ziwei";
import { divinationInputSchema } from "@/lib/divination/schemas";
import { ensureUserProfile, getUserProfile, insertDivination } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user ?? null;

    const parsed = divinationInputSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const { chart, birthGregorian, birthLunar } =
      parsed.data.divinationType === "liuyao"
        ? buildLiuyaoChart(parsed.data)
        : parsed.data.divinationType === "meihua"
          ? buildMeihuaChart(parsed.data)
        : parsed.data.divinationType === "sanshi"
          ? buildSanshiChart(parsed.data)
        : parsed.data.divinationType === "bazi"
          ? buildBaziChart(parsed.data)
          : parsed.data.divinationType === "ziwei"
            ? buildZiweiChart(parsed.data)
            : buildChengguChart(parsed.data);

    const divinationType =
      parsed.data.divinationType === "chenggu" || parsed.data.divinationType === "sanshi"
        ? "custom"
        : parsed.data.divinationType;

    if (!user) {
      return NextResponse.json({
        persisted: false,
        divination: {
          id: `preview-${crypto.randomUUID()}`,
          divination_type: divinationType,
          subject_name: parsed.data.subjectName || null,
          birth_gregorian: birthGregorian,
          birth_lunar: birthLunar,
          gender: parsed.data.gender,
          question: parsed.data.question,
          input_params: parsed.data,
          chart_json: chart,
          ai_result_markdown: null,
          ai_model: null,
          status: "preview",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    }

    await ensureUserProfile(user);

    const profile = await getUserProfile(user.id);
    const permission = canConsumeCredits(profile);

    if (!permission.allowed) {
      return NextResponse.json({ error: permission.reason }, { status: 402 });
    }

    await reserveDivinationCredits();

    const data = await insertDivination({
      userId: user.id,
      divinationType,
      subjectName: parsed.data.subjectName || null,
      birthGregorian,
      birthLunar,
      gender: parsed.data.gender,
      question: parsed.data.question,
      inputParams: parsed.data,
      chartJson: chart,
    });

    return NextResponse.json({ persisted: true, divination: data });
  } catch (error) {
    console.error("Divination creation failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "测算创建失败。",
      },
      { status: 500 },
    );
  }
}
