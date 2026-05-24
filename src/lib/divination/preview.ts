import type { Database } from "@/types/database";

export const DIVINATION_PREVIEW_STORAGE_KEY = "zhiwei:divination-preview";

type DivinationRow = Database["public"]["Tables"]["divinations"]["Row"];

let cachedPreviewRaw: string | null | undefined;
let cachedPreviewRecord: DivinationPreviewRecord | null = null;

export type DivinationPreviewRecord = Omit<DivinationRow, "user_id" | "credits_consumed"> & {
  input_params: unknown;
  chart_json: unknown;
};

export type DivinationCreateResponse =
  | {
      persisted: true;
      divination: DivinationRow;
    }
  | {
      persisted: false;
      divination: DivinationPreviewRecord;
    };

export function saveDivinationPreview(divination: DivinationPreviewRecord) {
  const raw = JSON.stringify(divination);

  cachedPreviewRaw = raw;
  cachedPreviewRecord = divination;
  window.sessionStorage.setItem(DIVINATION_PREVIEW_STORAGE_KEY, raw);
}

export function loadDivinationPreview() {
  const raw = window.sessionStorage.getItem(DIVINATION_PREVIEW_STORAGE_KEY);

  if (raw === cachedPreviewRaw) {
    return cachedPreviewRecord;
  }

  cachedPreviewRaw = raw;

  if (!raw) {
    cachedPreviewRecord = null;
    return null;
  }

  try {
    cachedPreviewRecord = JSON.parse(raw) as DivinationPreviewRecord;
    return cachedPreviewRecord;
  } catch {
    cachedPreviewRecord = null;
    window.sessionStorage.removeItem(DIVINATION_PREVIEW_STORAGE_KEY);
    return null;
  }
}

export function clearDivinationPreview() {
  cachedPreviewRaw = null;
  cachedPreviewRecord = null;
  window.sessionStorage.removeItem(DIVINATION_PREVIEW_STORAGE_KEY);
}
