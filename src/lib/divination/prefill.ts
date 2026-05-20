import type { Database, Json } from "@/types/database";
import type { DivinationInputForm } from "./schemas";

type DivinationRow = Database["public"]["Tables"]["divinations"]["Row"];

export type DivinationPrefillRecord = {
  id: string;
  divinationType: string;
  subjectName: string;
  gender: DivinationInputForm["gender"];
  calendarType: DivinationInputForm["calendarType"];
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  birthPlaceMeta: DivinationInputForm["birthPlaceMeta"];
  isLeapMonth: boolean;
  createdAt: string;
};

function isJsonObject(value: Json | null | undefined): value is Record<string, Json> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: Json | undefined) {
  return typeof value === "string" ? value : "";
}

function readGender(value: Json | undefined): DivinationInputForm["gender"] | null {
  return value === "male" || value === "female" || value === "other" || value === "unknown"
    ? value
    : null;
}

function readCalendarType(value: Json | undefined): DivinationInputForm["calendarType"] | null {
  return value === "solar" || value === "lunar" ? value : null;
}

function readBirthPlaceMeta(value: Json | undefined): DivinationInputForm["birthPlaceMeta"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const label = readString(value.label);
  const shortLabel = readString(value.shortLabel);
  const lat = readString(value.lat);
  const lon = readString(value.lon);

  if (!label || !shortLabel || !lat || !lon) {
    return null;
  }

  return { label, shortLabel, lat, lon };
}

export function toDivinationPrefillRecord(
  row: DivinationRow,
): DivinationPrefillRecord | null {
  if (!isJsonObject(row.input_params)) {
    return null;
  }

  const subjectName = readString(row.input_params.subjectName) || row.subject_name || "";
  const gender = readGender(row.input_params.gender) ?? (row.gender as DivinationInputForm["gender"] | null);
  const calendarType = readCalendarType(row.input_params.calendarType);
  const birthDate = readString(row.input_params.birthDate);
  const birthTime = readString(row.input_params.birthTime);
  const birthPlace = readString(row.input_params.birthPlace);

  if (!gender || !calendarType || !birthDate || !birthTime) {
    return null;
  }

  return {
    id: row.id,
    divinationType: row.divination_type,
    subjectName,
    gender,
    calendarType,
    birthDate,
    birthTime,
    birthPlace,
    birthPlaceMeta: readBirthPlaceMeta(row.input_params.birthPlaceMeta),
    isLeapMonth: row.input_params.isLeapMonth === true,
    createdAt: row.created_at,
  };
}
