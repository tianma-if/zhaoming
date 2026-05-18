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

export function BaziVerdictCard({
  chart,
  divinationId,
  initialMarkdown,
}: {
  chart: BaziChart;
  divinationId: string;
  initialMarkdown: string | null;
}) {
  const localVerdict = useMemo(() => buildBaziStructureVerdict(chart), [chart]);
  const initialVerdict = useMemo(() => extractOpeningVerdict(initialMarkdown), [initialMarkdown]);

  const { complete, completion, error, isLoading } = useCompletion({
    api: "/api/ai/divination",
    body: {
      divinationId,
      mode: "verdict",
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
          <Badge>命格判词</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">先给这张命盘一个人设判断</CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-7">
            {hasModelVerdict
              ? "由 AI 基于四柱结构、五行强弱与用户问题生成，用来先抓住整张命盘的核心气质。"
              : "当前先展示结构化排盘摘要；生成后会替换为模型判词。"}
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
          {isLoading ? "生成中" : hasModelVerdict ? "重新生成判词" : "生成 AI 判词"}
        </Button>
      </div>

      <div className="border-t border-border bg-muted/35 px-6 py-5">
        <p className="max-w-5xl text-lg leading-9 text-foreground/88">{verdict}</p>
        {error ? (
          <p className="mt-3 text-sm text-destructive">
            AI 判词生成失败，请稍后再试。
          </p>
        ) : null}
      </div>
    </Card>
  );
}
