"use client";

import { useCompletion } from "@ai-sdk/react";
import { WandSparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MarkdownRenderer } from "@/components/prose/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const REQUEST_EVENT = "divination-ai-report:generate";
const STATE_EVENT = "divination-ai-report:state";

interface DivinationAiReportStateDetail {
  divinationId: string;
  hasContent: boolean;
  isLoading: boolean;
}

interface DivinationAiReportRequestDetail {
  divinationId: string;
}

export function DivinationAiReportButton({
  divinationId,
  initialHasContent,
}: {
  divinationId: string;
  initialHasContent: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasContent, setHasContent] = useState(initialHasContent);

  useEffect(() => {
    const handleState = (event: Event) => {
      const detail = (event as CustomEvent<DivinationAiReportStateDetail>).detail;

      if (detail.divinationId !== divinationId) {
        return;
      }

      setIsLoading(detail.isLoading);
      setHasContent(detail.hasContent);
    };

    window.addEventListener(STATE_EVENT, handleState as EventListener);

    return () => {
      window.removeEventListener(STATE_EVENT, handleState as EventListener);
    };
  }, [divinationId]);

  return (
    <Button
      className="h-12 rounded-2xl bg-foreground px-5 text-sm font-medium text-background shadow-[0_18px_38px_-20px_rgba(15,23,42,0.65)] transition-all hover:-translate-y-0.5 hover:bg-foreground/92 hover:shadow-[0_22px_44px_-20px_rgba(15,23,42,0.72)]"
      disabled={isLoading}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent<DivinationAiReportRequestDetail>(REQUEST_EVENT, {
            detail: { divinationId },
          }),
        );

        document.getElementById(`ai-report-${divinationId}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
      type="button"
    >
      <WandSparkles size={18} />
      {isLoading ? "AI 解读生成中" : hasContent ? "重新生成 AI 解读" : "立即 AI 解读"}
    </Button>
  );
}

export function DivinationAiReportCard({
  divinationId,
  initialMarkdown,
}: {
  divinationId: string;
  initialMarkdown: string | null;
}) {
  const [requested, setRequested] = useState(Boolean(initialMarkdown));
  const { complete, completion, error, isLoading } = useCompletion({
    api: "/api/ai/divination",
    body: {
      divinationId,
      mode: "full",
    },
    initialCompletion: initialMarkdown ?? "",
    streamProtocol: "text",
  });

  const content = useMemo(
    () => completion.trim() || initialMarkdown?.trim() || "",
    [completion, initialMarkdown],
  );
  const hasContent = Boolean(content);

  useEffect(() => {
    const handleRequest = (event: Event) => {
      const detail = (event as CustomEvent<DivinationAiReportRequestDetail>).detail;

      if (detail.divinationId !== divinationId) {
        return;
      }

      setRequested(true);
      void complete("");
    };

    window.addEventListener(REQUEST_EVENT, handleRequest as EventListener);

    return () => {
      window.removeEventListener(REQUEST_EVENT, handleRequest as EventListener);
    };
  }, [complete, divinationId]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent<DivinationAiReportStateDetail>(STATE_EVENT, {
        detail: {
          divinationId,
          hasContent,
          isLoading,
        },
      }),
    );
  }, [divinationId, hasContent, isLoading]);

  if (!requested && !hasContent) {
    return null;
  }

  return (
    <Card
      className="overflow-hidden rounded-[1.6rem] border border-border bg-white p-0"
      id={`ai-report-${divinationId}`}
    >
      <div className="grid gap-5 border-b border-border px-6 py-5 min-[1100px]:grid-cols-[minmax(0,1fr)_auto] min-[1100px]:items-start">
        <div className="space-y-3">
          <Badge>AI Report</Badge>
          <CardTitle className="text-3xl tracking-[0.04em]">AI 解读报告</CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-7">
            基于当前测算记录、用户问题和结构化排盘结果生成的整页解读，适合快速把握重点与行动建议。
          </CardDescription>
        </div>
      </div>

      <div className="bg-muted/25 px-6 py-6">
        {hasContent ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">
            正在根据命盘结构生成 AI 解读，请稍候片刻。
          </p>
        )}

        {error ? (
          <p className="mt-4 text-sm text-destructive">
            AI 解读生成失败：{error.message || "请稍后再试。"}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
