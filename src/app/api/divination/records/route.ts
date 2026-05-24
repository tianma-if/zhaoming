import { NextResponse } from "next/server";
import { getSessionFromHeaders } from "@/lib/auth/session";
import { ensureTrumpSampleDivinationForUser, listDivinationSummaries } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import type { Json } from "@/types/database";

const divinationTypeLabelMap: Record<string, string> = {
  bazi: "八字",
  ziwei: "紫微斗数",
  chenggu: "称骨",
  liuyao: "六爻",
  meihua: "梅花",
  sanshi: "三式",
};

const sanshiSystemLabelMap: Record<string, string> = {
  qimen: "奇门遁甲",
  taiyi: "太乙神数",
  liuren: "大六壬",
};

function isJsonObject(value: Json | null | undefined): value is Record<string, Json> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: Json | undefined) {
  return typeof value === "string" ? value : "";
}

function resolveRecordTypeLabel(item: Awaited<ReturnType<typeof listDivinationSummaries>>[number], type: string) {
  if (type !== "sanshi") {
    return divinationTypeLabelMap[type] ?? type;
  }

  if (isJsonObject(item.chart_json) && isJsonObject(item.chart_json.meta)) {
    const systemLabel = readString(item.chart_json.meta.systemLabel);

    if (systemLabel) {
      return systemLabel;
    }
  }

  if (isJsonObject(item.input_params)) {
    const system = readString(item.input_params.system);

    if (system) {
      return sanshiSystemLabelMap[system] ?? system;
    }
  }

  return divinationTypeLabelMap[type] ?? type;
}

export async function GET(request: Request) {
  try {
    const session = await getSessionFromHeaders(request.headers);
    const user = session?.user ?? null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureTrumpSampleDivinationForUser(user);

    const records = (await listDivinationSummaries(user.id)).map((item) => {
      const type = resolveDivinationTypeFromRecord(item);

      return {
        id: item.id,
        type,
        typeLabel: resolveRecordTypeLabel(item, type),
        subjectName: item.subject_name ?? "",
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
