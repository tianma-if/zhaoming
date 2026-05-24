import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ensureTrumpSampleDivinationForUser, listRecentDivinations } from "@/lib/data";
import { toDivinationPrefillRecord } from "@/lib/divination/prefill";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user ?? null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureTrumpSampleDivinationForUser(user);

    const records = (await listRecentDivinations(user.id, 8))
      .map(toDivinationPrefillRecord)
      .filter((item) => item !== null);

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Failed to load prefill records:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load prefill records.",
      },
      { status: 500 },
    );
  }
}
