import type { Metadata } from "next";
import { DivinationPreview } from "@/components/divination/divination-preview";
import { getGoogleOneTapClientId } from "@/lib/env";

export const metadata: Metadata = {
  title: "基础排盘预览",
};

export default function DivinationPreviewPage() {
  return <DivinationPreview googleClientId={getGoogleOneTapClientId() ?? null} />;
}
