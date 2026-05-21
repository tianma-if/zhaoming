import type { Database, Json } from "@/types/database";

type DivinationRow = Database["public"]["Tables"]["divinations"]["Row"];

function isJsonObject(value: Json | null | undefined): value is Record<string, Json> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: Json | undefined) {
  return typeof value === "string" ? value : "";
}

export function resolveDivinationTypeFromRecord(row: Pick<
  DivinationRow,
  "divination_type" | "input_params" | "chart_json"
>) {
  if (row.divination_type !== "custom") {
    return row.divination_type;
  }

  if (isJsonObject(row.input_params)) {
    const inputType = readString(row.input_params.divinationType);

    if (inputType) {
      return inputType;
    }
  }

  if (isJsonObject(row.chart_json)) {
    const kind = readString(row.chart_json.kind);

    if (kind) {
      return kind;
    }
  }

  return row.divination_type;
}
