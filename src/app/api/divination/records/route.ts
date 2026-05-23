import { NextResponse } from "next/server";
import { getSessionFromHeaders } from "@/lib/auth/session";
import { listDivinationSummaries } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";

const divinationTypeLabelMap: Record<string, string> = {
  bazi: "八字",
  ziwei: "紫微斗数",
  chenggu: "称骨",
  liuyao: "六爻",
  sanshi: "三式",
};

export async function GET(request: Request) {
  try {
    const session = await getSessionFromHeaders(request.headers);
    const user = session?.user ?? null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const records = (await listDivinationSummaries(user.id)).map((item) => {
      const type = resolveDivinationTypeFromRecord(item);

      return {
        id: item.id,
        type,
        typeLabel: divinationTypeLabelMap[type] ?? type,
        question: item.question,
        status: item.status,
        created_at: item.created_at,
      };
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Failed to load divination records:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load divination records.",
      },
      { status: 500 },
    );
  }
}
