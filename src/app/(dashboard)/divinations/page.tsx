import type { Metadata } from "next";
import Link from "next/link";
import {
  DashboardPage,
  DashboardPageHeader,
} from "@/components/layout/dashboard-shell";
import { DivinationRecordsPanel } from "@/components/divination/divination-records-panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "测算记录",
};

export default function DivinationsPage() {
  return (
    <DashboardPage width="wide">
      <DashboardPageHeader
        eyebrow="History"
        title="测算记录"
        action={
          <Button asChild className="rounded-xl px-4">
            <Link href="/divinations/new">发起新测算</Link>
          </Button>
        }
      />
      <DivinationRecordsPanel />
    </DashboardPage>
  );
}
