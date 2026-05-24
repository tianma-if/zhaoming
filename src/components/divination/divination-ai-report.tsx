"use client";

import { useCompletion } from "@ai-sdk/react";
import { WandSparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiReportCard } from "@/components/divination/ai-report-card";
import { Button } from "@/components/ui/button";

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
  autoStart = false,
}: {
  divinationId: string;
  initialMarkdown: string | null;
  autoStart?: boolean;
}) {
  const [requested, setRequested] = useState(Boolean(initialMarkdown));
  const autoStartedRef = useRef(false);
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

  useEffect(() => {
    if (!autoStart || initialMarkdown || autoStartedRef.current) {
      return;
    }

    autoStartedRef.current = true;
    setRequested(true);
    void complete("");
  }, [autoStart, complete, initialMarkdown]);

  if (!requested && !hasContent) {
    return null;
  }

  return (
    <AiReportCard
      content={content}
      errorMessage={error ? `AI 解读生成失败：${error.message || "请稍后再试。"}` : null}
      id={`ai-report-${divinationId}`}
      isLoading={isLoading}
    />
  );
}
