"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardEmptyState } from "@/components/layout/dashboard-shell";
import {
  DivinationRecordsTable,
  type DivinationRecordTableRow,
} from "@/components/divination/divination-records-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/components/i18n-provider";

type LoadState =
  | { status: "loading"; records: DivinationRecordTableRow[]; error: null }
  | { status: "ready"; records: DivinationRecordTableRow[]; error: null }
  | { status: "error"; records: DivinationRecordTableRow[]; error: string };

export function DivinationRecordsPanel() {
  const { t } = useI18n();
  const [state, setState] = useState<LoadState>({
    status: "loading",
    records: [],
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecords() {
      try {
        const response = await fetch("/api/divination/records", {
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          records?: DivinationRecordTableRow[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? t("page.recordsLoadFailed"));
        }

        setState({
          status: "ready",
          records: payload.records ?? [],
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          status: "error",
          records: [],
          error: error instanceof Error ? error.message : t("page.recordsLoadFailed"),
        });
      }
    }

    void loadRecords();

    return () => controller.abort();
  }, [t]);

  if (state.status === "loading") {
    return <DivinationRecordsSkeleton />;
  }

  if (state.status === "error") {
    return (
      <DashboardEmptyState
        title={t("page.recordsLoadFailed")}
        description={state.error}
        action={<Button onClick={() => window.location.reload()}>{t("page.reload")}</Button>}
      />
    );
  }

  if (!state.records.length) {
    return (
      <DashboardEmptyState
        title={t("page.noRecords")}
        description={t("page.noRecordsDescription")}
        action={
          <Button asChild>
            <Link href="/divinations/new">{t("page.newReading")}</Link>
          </Button>
        }
      />
    );
  }

  return <DivinationRecordsTable data={state.records} />;
}

function DivinationRecordsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <Skeleton className="h-10 w-full md:max-w-sm" />
          <Skeleton className="h-10 w-full md:w-36" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-[0.8fr_1fr_2fr_1.4fr_0.6fr] border-b px-2 py-3">
          {["类型", "测算人姓名", "问题", "创建时间", ""].map((item) => (
            <span key={item} className="text-sm font-medium">
              {item}
            </span>
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.8fr_1fr_2fr_1.4fr_0.6fr] items-center border-b px-2 py-4 last:border-b-0"
          >
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-48 max-w-full" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="ml-auto h-5 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
