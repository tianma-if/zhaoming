"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { ChevronDown, LoaderCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownRenderer } from "@/components/prose/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ComparableAiModel } from "@/lib/ai/model-comparison";

interface BaziRecordOption {
  id: string;
  subjectName: string | null;
  question: string;
  createdAt: string;
}

interface ComparisonOutput {
  modelId: string;
  label: string;
  vendor: string;
  durationMs: number;
  text: string;
  error: string | null;
}

interface ComparisonResponse {
  divinationId: string;
  mode: "short" | "full";
  system: string;
  prompt: string;
  outputs: ComparisonOutput[];
}

interface ComparisonErrorResponse {
  error?: string;
}

interface DisclaimerMatch {
  ruleId: string;
  label: string;
  keyword: string;
}

const DISCLAIMER_RULES = [
  {
    id: "deepseek-generated",
    label: "模型来源说明",
    patterns: ["以上内容由DeepSeek生成", "以上内容由 AI 生成", "以上内容由AI生成"],
  },
  {
    id: "entertainment-only",
    label: "仅供娱乐",
    patterns: ["仅供娱乐参考", "仅供参考娱乐", "娱乐参考"],
  },
  {
    id: "do-not-believe",
    label: "切勿轻信",
    patterns: ["切勿轻信", "请勿过度迷信", "请理性看待", "请勿完全当真"],
  },
  {
    id: "focus-reality",
    label: "回归现实劝导",
    patterns: ["更专注于现实生活", "现实生活中的自我发现", "属于自己的那份内在安宁", "内在安宁与节奏"],
  },
] as const;

function formatDuration(durationMs: number) {
  if (durationMs < 1000) {
    return `${durationMs} ms`;
  }

  return `${(durationMs / 1000).toFixed(1)} s`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectDisclaimerMatches(text: string) {
  return DISCLAIMER_RULES.flatMap((rule) =>
    rule.patterns
      .filter((pattern) => text.includes(pattern))
      .map((pattern) => ({
        ruleId: rule.id,
        label: rule.label,
        keyword: pattern,
      })),
  );
}

function buildHighlightRegex(matches: DisclaimerMatch[]) {
  if (!matches.length) {
    return null;
  }

  const uniqueKeywords = [...new Set(matches.map((item) => item.keyword))];
  return new RegExp(`(${uniqueKeywords.map(escapeRegExp).join("|")})`, "g");
}

function highlightText(text: string, regex: RegExp | null, keyPrefix: string) {
  if (!regex) {
    return text;
  }

  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    regex.lastIndex = 0;

    if (regex.test(part)) {
      return (
        <mark
          key={`${keyPrefix}-${index}`}
          className="rounded bg-amber-200/80 px-1 py-0.5 text-foreground"
        >
          {part}
        </mark>
      );
    }

    return part;
  });
}

function highlightNode(node: ReactNode, regex: RegExp | null, keyPrefix: string): ReactNode {
  if (typeof node === "string") {
    return highlightText(node, regex, keyPrefix);
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => highlightNode(child, regex, `${keyPrefix}-${index}`));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(node, {
      ...node.props,
      children: Children.map(node.props.children, (child, index) =>
        highlightNode(child, regex, `${keyPrefix}-${index}`),
      ),
    });
  }

  return node;
}

function HighlightedMarkdownRenderer({
  content,
  regex,
}: {
  content: string;
  regex: RegExp | null;
}) {
  if (!regex) {
    return <MarkdownRenderer content={content} />;
  }

  return (
    <div className="prose-minimal">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p>{highlightNode(children, regex, "p")}</p>,
          li: ({ children }) => <li>{highlightNode(children, regex, "li")}</li>,
          h1: ({ children }) => <h1>{highlightNode(children, regex, "h1")}</h1>,
          h2: ({ children }) => <h2>{highlightNode(children, regex, "h2")}</h2>,
          h3: ({ children }) => <h3>{highlightNode(children, regex, "h3")}</h3>,
          blockquote: ({ children }) => (
            <blockquote>{highlightNode(children, regex, "blockquote")}</blockquote>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function BaziModelCompareDemo({
  records,
  models,
  initialDivinationId,
}: {
  records: BaziRecordOption[];
  models: ComparableAiModel[];
  initialDivinationId?: string;
}) {
  const fallbackDivinationId =
    initialDivinationId && records.some((item) => item.id === initialDivinationId)
      ? initialDivinationId
      : records[0]?.id;
  const [selectedDivinationId, setSelectedDivinationId] = useState(fallbackDivinationId ?? "");
  const [mode, setMode] = useState<"short" | "full">("full");
  const [result, setResult] = useState<ComparisonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedRecord = useMemo(
    () => records.find((item) => item.id === selectedDivinationId) ?? null,
    [records, selectedDivinationId],
  );

  const modelIds = useMemo(() => models.map((item) => item.id), [models]);

  const handleGenerate = () => {
    if (!selectedDivinationId) {
      setError("请先选择一个八字记录。");
      return;
    }

    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/ai/divination-compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          divinationId: selectedDivinationId,
          mode,
          models: modelIds,
        }),
      });

      const payload = (await response.json()) as ComparisonResponse | ComparisonErrorResponse;

      if (!response.ok) {
        setResult(null);
        setError(
          "error" in payload ? payload.error ?? "模型对比失败，请稍后再试。" : "模型对比失败，请稍后再试。",
        );
        return;
      }

      setResult(payload as ComparisonResponse);
    });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem] border border-border bg-white/95 p-6 shadow-none">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(220px,0.8fr)_auto] lg:items-end">
          <div className="space-y-2">
            <Badge>Same Prompt / Multi Model</Badge>
            <CardTitle className="text-3xl tracking-[0.04em]">八字模型对比 Demo</CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-7">
              固定同一条八字记录、同一份 system prompt 与输入数据，并排查看 DeepSeek 与
              Gemini 在文风、结构、收尾和免责声明上的区别。
            </CardDescription>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">八字记录</p>
              <Select value={selectedDivinationId} onValueChange={setSelectedDivinationId}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="选择一个八字记录" />
                </SelectTrigger>
                <SelectContent>
                  {records.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {(item.subjectName?.trim() || "未命名命盘") + " · " + item.createdAt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">输出模式</p>
              <Select value={mode} onValueChange={(value) => setMode(value as "short" | "full")}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">完整解读</SelectItem>
                  <SelectItem value="short">短判词</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="h-11 rounded-xl px-5"
            disabled={isPending || !selectedDivinationId}
            onClick={handleGenerate}
            type="button"
          >
            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles size={16} />}
            {isPending ? "对比生成中" : "开始对比"}
          </Button>
        </div>

        {selectedRecord ? (
          <div className="mt-5 rounded-[1.25rem] border border-border/70 bg-muted/30 p-4 text-sm leading-7">
            <p className="font-medium text-foreground">
              {selectedRecord.subjectName?.trim() || "未命名命盘"}
            </p>
            <p className="mt-1 text-muted-foreground">{selectedRecord.question}</p>
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {models.map((model) => (
            <div key={model.id} className="rounded-[1.2rem] border border-border/70 bg-muted/25 p-4">
              <p className="text-sm font-medium text-foreground">{model.label}</p>
              <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {model.vendor}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{model.note}</p>
            </div>
          ))}
        </div>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </Card>

      <Collapsible className="rounded-[1.75rem] border border-border bg-white/95 p-0 shadow-none">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-5 text-left">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">查看本次实际使用的 Prompt</p>
            <p className="text-sm text-muted-foreground">
              这里会展示完全相同的 system prompt 和拼装后的命盘输入，方便排除 prompt 干扰。
            </p>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent className="grid gap-4 border-t border-border px-6 py-5 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">System</p>
            <pre className="max-h-[420px] overflow-auto rounded-[1.2rem] bg-muted/35 p-4 text-sm leading-7 whitespace-pre-wrap">
              {result?.system ?? "生成后可在这里核对 system prompt。"}
            </pre>
          </div>
          <div className="space-y-2">
            <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">Prompt</p>
            <pre className="max-h-[420px] overflow-auto rounded-[1.2rem] bg-muted/35 p-4 text-sm leading-7 whitespace-pre-wrap">
              {result?.prompt ?? "生成后可在这里核对拼装后的命盘输入。"}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="grid gap-6 xl:grid-cols-3">
        {models.map((model) => {
          const output = result?.outputs.find((item) => item.modelId === model.id) ?? null;
          const disclaimerMatches = output?.text ? detectDisclaimerMatches(output.text) : [];
          const highlightRegex = buildHighlightRegex(disclaimerMatches);

          return (
            <Card
              key={model.id}
              className="flex min-h-[32rem] flex-col rounded-[1.75rem] border border-border bg-white/95 p-0 shadow-none"
            >
              <div className="space-y-3 border-b border-border px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{model.label}</p>
                    <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                      {model.vendor}
                    </p>
                  </div>
                  {output ? (
                    <Badge variant="outline" className="rounded-full bg-muted/40">
                      {formatDuration(output.durationMs)}
                    </Badge>
                  ) : null}
                </div>

                {output?.text ? (
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={
                        disclaimerMatches.length
                          ? "rounded-full border-amber-300 bg-amber-100 text-amber-900"
                          : "rounded-full border-emerald-300 bg-emerald-100 text-emerald-900"
                      }
                      variant="outline"
                    >
                      {disclaimerMatches.length ? "命中免责声明" : "未命中免责声明"}
                    </Badge>
                    {disclaimerMatches.map((match) => (
                      <Badge
                        key={`${model.id}-${match.ruleId}-${match.keyword}`}
                        className="rounded-full border-amber-200 bg-amber-50 text-amber-800"
                        variant="outline"
                      >
                        {match.label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex-1 px-6 py-5">
                {!result ? (
                  <p className="text-sm leading-7 text-muted-foreground">
                    还没开始生成。点上面的“开始对比”后，这里会显示该模型的完整输出。
                  </p>
                ) : output?.error ? (
                  <p className="text-sm leading-7 text-destructive">{output.error}</p>
                ) : output?.text ? (
                  <div className="space-y-4">
                    {disclaimerMatches.length ? (
                      <div className="rounded-[1.1rem] border border-amber-200 bg-amber-50/80 p-4 text-sm leading-6 text-amber-950">
                        <p className="font-medium">检测到可能影响沉浸感的免责声明或劝退收尾。</p>
                        <p className="mt-1 text-amber-900/90">
                          已在正文中高亮命中词，方便你快速比较哪一档模型更容易自己踩刹车。
                        </p>
                      </div>
                    ) : null}
                    <HighlightedMarkdownRenderer content={output.text} regex={highlightRegex} />
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-muted-foreground">该模型没有返回内容。</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
