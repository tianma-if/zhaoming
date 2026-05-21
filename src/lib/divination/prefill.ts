import type { Database, Json } from "@/types/database";
import { resolveDivinationTypeFromRecord } from "./record-type";
import type { BirthDivinationInputForm } from "./schemas";

type DivinationRow = Database["public"]["Tables"]["divinations"]["Row"];

export type DivinationPrefillRecord = {
  id: string;
  divinationType: string;
  subjectName: string;
  gender: BirthDivinationInputForm["gender"];
  calendarType: BirthDivinationInputForm["calendarType"];
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  birthPlaceMeta: BirthDivinationInputForm["birthPlaceMeta"];
  isLeapMonth: boolean;
  createdAt: string;
};

function isJsonObject(value: Json | null | undefined): value is Record<string, Json> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: Json | undefined) {
  return typeof value === "string" ? value : "";
}

function readGender(value: Json | undefined): BirthDivinationInputForm["gender"] | null {
  return value === "male" || value === "female" || value === "other" || value === "unknown"
    ? value
    : null;
}

function readCalendarType(value: Json | undefined): BirthDivinationInputForm["calendarType"] | null {
  return value === "solar" || value === "lunar" ? value : null;
}

function readBirthPlaceMeta(value: Json | undefined): BirthDivinationInputForm["birthPlaceMeta"] {
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
  const gender =
    readGender(row.input_params.gender) ??
    (row.gender as BirthDivinationInputForm["gender"] | null);
  const calendarType = readCalendarType(row.input_params.calendarType);
  const birthDate = readString(row.input_params.birthDate);
  const birthTime = readString(row.input_params.birthTime);
  const birthPlace = readString(row.input_params.birthPlace);

  if (!gender || !calendarType || !birthDate || !birthTime) {
    return null;
  }

  return {
    id: row.id,
    divinationType: resolveDivinationTypeFromRecord(row),
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
