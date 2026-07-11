"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { MarkdownRenderer } from "@/components/prose/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

interface AiReportCardProps {
  id?: string;
  title?: string;
  content: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  loadingMessage?: string;
  className?: string;
}

export function AiReportCard({
  id,
  title,
  content,
  isLoading = false,
  errorMessage,
  loadingMessage,
  className,
}: AiReportCardProps) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t("ai.title");
  const resolvedLoadingMessage = loadingMessage ?? t("ai.loading");
  const [isOpen, setIsOpen] = useState(true);
  const hasContent = Boolean(content.trim());
  const CollapseIcon = isOpen ? ChevronUp : ChevronDown;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card
        className={cn("overflow-hidden rounded-[1.6rem] border border-border bg-white p-0", className)}
        id={id}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-b border-border px-6 py-4">
          <div className="space-y-3">
            <CardTitle className="text-xl tracking-[0.02em] sm:text-2xl">{resolvedTitle}</CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              aria-label={isOpen ? t("ai.collapse") : t("ai.expand")}
              className="h-9 w-9 rounded-full border border-border bg-white/70 p-0 text-muted-foreground hover:bg-muted hover:text-foreground"
              size="sm"
              type="button"
              variant="ghost"
            >
              <CollapseIcon size={18} />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="bg-muted/25 px-6 py-6">
            {hasContent ? (
              <MarkdownRenderer content={content} />
            ) : isLoading ? (
              <p className="text-sm leading-7 text-muted-foreground">{resolvedLoadingMessage}</p>
            ) : null}

            {errorMessage ? <p className="mt-4 text-sm text-destructive">{errorMessage}</p> : null}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
