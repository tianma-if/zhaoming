import type { Metadata } from "next";
import Link from "next/link";
import {
  DashboardPage,
  DashboardPageHeader,
} from "@/components/layout/dashboard-shell";
import { DivinationRecordsPanel } from "@/components/divination/divination-records-panel";
import { Button } from "@/components/ui/button";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "测算记录",
};

export default async function DivinationsPage() {
  const locale = await getLocale();
  return (
    <DashboardPage width="wide">
      <DashboardPageHeader
        eyebrow="History"
        title={translate(locale, "dashboard.recordsTitle")}
        action={
          <Button asChild className="rounded-xl px-4">
            <Link href="/divinations/new">{translate(locale, "dashboard.start")}</Link>
          </Button>
        }
      />
      <DivinationRecordsPanel />
    </DashboardPage>
  );
}
