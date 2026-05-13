"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCompletion } from "@ai-sdk/react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/prose/markdown-renderer";

export function AiReadingPanel({
  divinationId,
  question,
}: {
  divinationId: string;
  question: string;
}) {
  const router = useRouter();
  const startedRef = useRef(false);
  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/ai/divination",
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void complete(question, { body: { divinationId } });
  }, [complete, divinationId, question]);

  return (
    <Card className="space-y-5 rounded-[1.6rem] border border-border bg-white shadow-none">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-[0.04em]">AI 解盘</CardTitle>
          <CardDescription className="text-sm leading-7">
            结合当前命盘结构，按流式方式展开解读。
          </CardDescription>
        </div>
        <Button variant="outline" onClick={() => void complete(question, { body: { divinationId } })}>
          {isLoading ? "生成中…" : "重新解读"}
        </Button>
      </div>

      {completion ? (
        <MarkdownRenderer content={completion} />
      ) : (
        <p className="text-sm leading-8 text-muted-foreground">
          {isLoading
            ? "正在根据排盘结构生成分析，请稍候。"
            : "提交测算后，这里会出现流式解盘结果。"}
        </p>
      )}

      {error ? (
        <p className="text-sm text-fire">
          {error.message || "模型暂时不可用，请检查 AI_PROVIDER 与模型配置。"}
        </p>
      ) : null}

      {!isLoading && completion ? (
        <Button variant="ghost" onClick={() => router.refresh()}>
          刷新服务端记录
        </Button>
      ) : null}
    </Card>
  );
}
