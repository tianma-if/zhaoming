"use client";

import { useCompletion } from "@ai-sdk/react";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  buildBaziStructureVerdict,
  extractOpeningVerdict,
} from "@/lib/divination/bazi-verdict";
import type { BaziChart } from "@/types/divination";
import { useI18n } from "@/components/i18n-provider";

export function BaziVerdictCard({
  chart,
  divinationId,
  initialMarkdown,
}: {
  chart: BaziChart;
  divinationId: string;
  initialMarkdown: string | null;
}) {
  const { t } = useI18n();
  const localVerdict = useMemo(() => buildBaziStructureVerdict(chart), [chart]);
  const initialVerdict = useMemo(() => extractOpeningVerdict(initialMarkdown), [initialMarkdown]);

  const { complete, completion, error, isLoading } = useCompletion({
    api: "/api/ai/divination",
    body: {
      divinationId,
      mode: "short",
    },
    initialCompletion: initialVerdict,
    streamProtocol: "text",
  });

  const verdict = completion || initialVerdict || localVerdict;
  const hasModelVerdict = Boolean(completion || initialVerdict);

  return (
    <Card className="overflow-hidden rounded-[1.6rem] border border-border bg-white p-0 shadow-none">
      <div className="grid gap-5 p-6 min-[1100px]:grid-cols-[minmax(0,1fr)_auto] min-[1100px]:items-start">
        <div className="space-y-3">
          <Badge>{t("chart.verdict")}</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">{t("chart.verdictTitle")}</CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-7">
            {hasModelVerdict ? t("chart.verdictAi") : t("chart.verdictStructured")}
          </CardDescription>
        </div>

        <Button
          className="rounded-xl px-4"
          disabled={isLoading}
          onClick={() => {
            void complete("");
          }}
          type="button"
        >
          <Sparkles size={16} />
          {isLoading ? t("chart.verdictLoading") : hasModelVerdict ? t("chart.verdictRegenerate") : t("chart.verdictGenerate")}
        </Button>
      </div>

      <div className="border-t border-border bg-muted/35 px-6 py-5">
        <p className="max-w-5xl text-lg leading-9 text-foreground/88">{verdict}</p>
        {error ? (
          <p className="mt-3 text-sm text-destructive">
            {t("chart.verdictFailed")}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
