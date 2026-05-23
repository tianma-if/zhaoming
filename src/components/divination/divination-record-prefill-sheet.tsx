"use client";

import { ChevronRight, History } from "lucide-react";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { DivinationPrefillRecord } from "@/lib/divination/prefill";
import type { BirthDivinationInputForm } from "@/lib/divination/schemas";
import { formatDateTime } from "@/lib/utils";

function getDivinationTypeLabel(type: string) {
  if (type === "bazi") return "八字";
  if (type === "ziwei") return "紫微斗数";
  if (type === "chenggu") return "称骨";
  if (type === "liuyao") return "六爻";
  if (type === "sanshi") return "三式";
  if (type === "custom") return "自定义";
  return type;
}

export function DivinationRecordPrefillSheet({
  form,
  records,
  isLoading = false,
}: {
  form: UseFormReturn<BirthDivinationInputForm>;
  records: DivinationPrefillRecord[];
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [records],
  );

  if (!isLoading && !sortedRecords.length) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-xl px-4" disabled={isLoading}>
          <History className="size-4" />
          {isLoading ? "正在加载记录..." : "从记录填充"}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="border-b border-border px-6 py-6">
          <SheetTitle>选择历史记录</SheetTitle>
          <SheetDescription>选择一条已有记录，快速填充当前排盘表单。</SheetDescription>
        </SheetHeader>

        <div className="space-y-3 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-5 text-sm text-muted-foreground">
              正在读取最近测算记录，稍等片刻。
            </div>
          ) : null}

          {sortedRecords.map((record) => (
            <button
              key={record.id}
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-white px-4 py-4 text-left transition hover:border-foreground/30 hover:bg-muted/20"
              onClick={() => {
                const currentValues = form.getValues();

                form.reset({
                  ...currentValues,
                  subjectName: record.subjectName,
                  gender: record.gender,
                  calendarType: record.calendarType,
                  birthDate: record.birthDate,
                  birthTime: record.birthTime,
                  birthPlace: record.birthPlace,
                  birthPlaceMeta: record.birthPlaceMeta,
                  isLeapMonth: record.isLeapMonth,
                });
                setOpen(false);
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {record.subjectName || "未命名记录"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getDivinationTypeLabel(record.divinationType)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {record.birthDate} {record.birthTime}
                </p>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {record.birthPlace || "未填写出生地"}
                </p>
                <p className="text-xs text-muted-foreground">
                  创建时间：{formatDateTime(record.createdAt)}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
