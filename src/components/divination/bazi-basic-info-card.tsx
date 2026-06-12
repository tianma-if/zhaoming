import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyContentButton } from "./copy-content-button";

interface SummaryItem {
  label: string;
  value: string;
}

function formatSummaryCopy({
  baziText,
  coreSummary,
  derivedSummary,
}: {
  baziText: string;
  coreSummary: SummaryItem[];
  derivedSummary: SummaryItem[];
}) {
  return [
    "基本信息",
    `八字：${baziText}`,
    ...coreSummary.map((item) => `${item.label}：${item.value}`),
    ...derivedSummary.map((item) => `${item.label}：${item.value}`),
  ].join("\n");
}

export function BaziBasicInfoCard({
  baziText,
  coreSummary,
  derivedSummary,
}: {
  baziText: string;
  coreSummary: SummaryItem[];
  derivedSummary: SummaryItem[];
}) {
  const copyText = formatSummaryCopy({ baziText, coreSummary, derivedSummary });

  return (
    <Card className="space-y-3 rounded-[1.6rem] border border-border bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-[1.7rem] tracking-[0.04em]">基本信息</CardTitle>
          <CardDescription className="text-sm text-foreground">八字：{baziText}</CardDescription>
        </div>
        <CopyContentButton
          className="h-8 rounded-md px-2.5 text-xs"
          label="复制内容"
          text={copyText}
        />
      </div>

      <dl className="grid gap-x-6 gap-y-2.5 text-xs [grid-template-columns:repeat(auto-fit,minmax(min(100%,11rem),1fr))]">
        {coreSummary.map((item) => (
          <div key={item.label} className="space-y-0.5">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="break-words font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>

      {derivedSummary.length > 0 ? (
        <>
          <Separator />
          <dl className="grid gap-x-6 gap-y-2.5 text-xs [grid-template-columns:repeat(auto-fit,minmax(min(100%,8rem),1fr))]">
            {derivedSummary.map((item) => (
              <div key={item.label} className="space-y-0.5">
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="break-words font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
    </Card>
  );
}
