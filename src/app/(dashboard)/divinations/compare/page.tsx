import type { Metadata } from "next";
import Link from "next/link";
import { BaziModelCompareDemo } from "@/components/divination/bazi-model-compare-demo";
import {
  DashboardEmptyState,
  DashboardPage,
  DashboardPageHeader,
} from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { BAZI_DEMO_MODEL_OPTIONS } from "@/lib/ai/model-comparison";
import { requireUser } from "@/lib/auth/session";
import { ensureTrumpSampleDivinationForUser, listDivinations } from "@/lib/data";
import { resolveDivinationTypeFromRecord } from "@/lib/divination/record-type";
import { formatDateTime } from "@/lib/utils";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "八字模型对比",
};

export default async function DivinationComparePage({
  searchParams,
}: {
  searchParams: Promise<{ divinationId?: string }>;
}) {
  const { divinationId } = await searchParams;
  const locale = await getLocale();
  const user = await requireUser();
  await ensureTrumpSampleDivinationForUser(user);
  const records = await listDivinations(user.id);
  const baziRecords = records
    .filter((item) => resolveDivinationTypeFromRecord(item) === "bazi")
    .map((item) => ({
      id: item.id,
      subjectName: item.subject_name,
      question: item.question,
      createdAt: formatDateTime(item.created_at),
    }));

  return (
    <DashboardPage width="full">
      <DashboardPageHeader
        eyebrow="Lab"
        title={translate(locale, "page.bazi")}
        description={translate(locale, "page.baziDescription")}
        action={
          <Button asChild className="rounded-xl px-4" variant="outline">
            <Link href="/divinations">{translate(locale, "page.backRecords")}</Link>
          </Button>
        }
      />

      {baziRecords.length ? (
        <BaziModelCompareDemo
          initialDivinationId={divinationId}
          models={BAZI_DEMO_MODEL_OPTIONS}
          records={baziRecords}
        />
      ) : (
        <DashboardEmptyState
          title={translate(locale, "page.noBazi")}
          description={translate(locale, "page.noBaziDescription")}
          action={
            <Button asChild>
              <Link href="/divinations/new">{translate(locale, "page.createBazi")}</Link>
            </Button>
          }
        />
      )}
    </DashboardPage>
  );
}
