import type { Metadata } from "next";
import { DivinationPreview } from "@/components/divination/divination-preview";
import { getEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "基础排盘预览",
};

export default function DivinationPreviewPage() {
  return <DivinationPreview googleClientId={getEnv().GOOGLE_CLIENT_ID ?? null} />;
}
