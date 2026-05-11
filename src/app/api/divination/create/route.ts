import { NextResponse } from "next/server";
import { canConsumeCredits, reserveDivinationCredits } from "@/lib/billing/credits";
import { buildBaziChart } from "@/lib/divination/adapters/bazi";
import { buildZiweiChart } from "@/lib/divination/adapters/ziwei";
import { divinationInputSchema } from "@/lib/divination/schemas";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = divinationInputSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const profileResult = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();
  const permission = canConsumeCredits(profileResult.data ?? null);

  if (!permission.allowed) {
    return NextResponse.json({ error: permission.reason }, { status: 402 });
  }

  const { chart, birthGregorian, birthLunar } =
    parsed.data.divinationType === "bazi"
      ? buildBaziChart(parsed.data)
      : buildZiweiChart(parsed.data);

  await reserveDivinationCredits();

  const { data, error } = await supabase
    .from("divinations")
    .insert({
      user_id: user.id,
      divination_type: parsed.data.divinationType,
      subject_name: parsed.data.subjectName || null,
      birth_gregorian: birthGregorian,
      birth_lunar: birthLunar,
      gender: parsed.data.gender,
      question: parsed.data.question,
      input_params: parsed.data,
      chart_json: chart,
      status: "pending",
    } as never)
    .select("id, divination_type, question, chart_json")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ divination: data });
}
