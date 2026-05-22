"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CircleHelp, Coins, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { createCoinGeneratedLines } from "@/lib/divination/adapters/liuyao";
import { getHexagramByLines } from "@/lib/divination/liuyao-hexagrams";
import { liuyaoInputSchema, type LiuyaoInputForm } from "@/lib/divination/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const lineLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;

const HEXAGRAM_SYMBOLS: Record<string, string> = {
  乾: "䷀",
  坤: "䷁",
  屯: "䷂",
  蒙: "䷃",
  需: "䷄",
  讼: "䷅",
  师: "䷆",
  比: "䷇",
  小畜: "䷈",
  履: "䷉",
  泰: "䷊",
  否: "䷋",
  同人: "䷌",
  大有: "䷍",
  谦: "䷎",
  豫: "䷏",
  随: "䷐",
  蛊: "䷑",
  临: "䷒",
  观: "䷓",
  噬嗑: "䷔",
  贲: "䷕",
  剥: "䷖",
  复: "䷗",
  无妄: "䷘",
  大畜: "䷙",
  颐: "䷚",
  大过: "䷛",
  坎: "䷜",
  离: "䷝",
  咸: "䷞",
  恒: "䷟",
  遯: "䷠",
  大壮: "䷡",
  晋: "䷢",
  明夷: "䷣",
  家人: "䷤",
  睽: "䷥",
  蹇: "䷦",
  解: "䷧",
  损: "䷨",
  益: "䷩",
  夬: "䷪",
  姤: "䷫",
  萃: "䷬",
  升: "䷭",
  困: "䷮",
  井: "䷯",
  革: "䷰",
  鼎: "䷱",
  震: "䷲",
  艮: "䷳",
  渐: "䷴",
  归妹: "䷵",
  丰: "䷶",
  旅: "䷷",
  巽: "䷸",
  兑: "䷹",
  涣: "䷺",
  节: "䷻",
  中孚: "䷼",
  小过: "䷽",
  既济: "䷾",
  未济: "䷿",
};

function createInitialValues(): LiuyaoInputForm {
  const today = new Date();

  return {
    divinationType: "liuyao",
    subjectName: "",
    gender: "unknown",
    question: "",
    divinationDate: format(today, "yyyy-MM-dd"),
    divinationTime: format(today, "HH:mm"),
    method: "manual",
    lineValues: [7, 8, 7, 8, 7, 8],
    notes: "",
  };
}

function getLineMeta(value: number) {
  if (value === 6) return { isYang: false, isMoving: true, label: "老阴", marker: "×" };
  if (value === 7) return { isYang: true, isMoving: false, label: "少阳", marker: "" };
  if (value === 8) return { isYang: false, isMoving: false, label: "少阴", marker: "" };
  return { isYang: true, isMoving: true, label: "老阳", marker: "○" };
}

function toggleLineMoving(value: number) {
  if (value === 6) return 8;
  if (value === 8) return 6;
  if (value === 7) return 9;
  return 7;
}

function cycleLineValue(value: number) {
  if (value === 7) return 8;
  if (value === 8) return 9;
  if (value === 9) return 6;
  return 7;
}

function buildHexagramPreview(lineValues: number[]) {
  const baseLines = lineValues.map((value) => (value === 7 || value === 9 ? 1 : 0));
  const changedLines = lineValues.map((value) =>
    value === 6 ? 1 : value === 9 ? 0 : value === 7 ? 1 : 0,
  );

  return {
    original: getHexagramByLines(baseLines),
    changed: getHexagramByLines(changedLines),
    movingLines: lineValues
      .map((value, index) => ({ value, index }))
      .filter((item) => item.value === 6 || item.value === 9)
      .map((item) => lineLabels[item.index]!),
  };
}

function getHexagramSymbol(name: string) {
  return HEXAGRAM_SYMBOLS[name] ?? "䷀";
}

function renderLineStroke(value: number) {
  const { isYang } = getLineMeta(value);

  if (isYang) {
    return <div className="h-3.5 w-full rounded-full bg-black" />;
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="h-3.5 w-[38%] rounded-full bg-black" />
      <div className="h-3.5 w-[38%] rounded-full bg-black" />
    </div>
  );
}

function getLineCardClass(value: number) {
  return value === 6 || value === 9
    ? "border-black/25 bg-stone-50 shadow-[0_6px_16px_-10px_rgba(0,0,0,0.35)]"
    : "border-black/12 bg-white shadow-[0_4px_10px_-8px_rgba(0,0,0,0.35)]";
}

function getChangeBadgeClass(value: number) {
  return value === 6 || value === 9
    ? "bg-black text-white"
    : "bg-black/5 text-black/55";
}

function LiuyaoConceptSection() {
  const items = [
    {
      title: "围绕具体问题起卦",
      description: "六爻更适合处理当下正在发生的现实问题，比如关系推进、合作得失、是否行动。",
    },
    {
      title: "看现状，也看变化",
      description: "本卦偏向当前格局，动爻提示关键变化点，变卦则更像局势后续可能展开的方向。",
    },
    {
      title: "先做基础版结果",
      description: "当前版本先提供起卦、本卦、变卦与动爻结果，后续再继续补齐世应、六亲等专业层。",
    },
  ] as const;

  return (
    <section className="space-y-8">
      <div className="space-y-4 text-center">
        <Badge>概念导读</Badge>
        <div className="space-y-3">
          <CardTitle className="text-4xl tracking-[0.06em] md:text-5xl">什么是六爻？</CardTitle>
          <CardDescription className="mx-auto max-w-3xl text-base leading-8">
            六爻占卜会围绕一个明确问题起卦，通过六条爻位、本卦、动爻和变卦，观察事情的当下结构与变化方向。
          </CardDescription>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="space-y-4 rounded-[1.5rem] border border-border bg-white p-6 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]"
          >
            <h3 className="font-display text-3xl tracking-[0.04em]">{item.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LiuyaoForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LiuyaoInputForm>({
    resolver: zodResolver(liuyaoInputSchema),
    defaultValues: createInitialValues(),
  });
  const lineValues = useWatch({
    control: form.control,
    name: "lineValues",
  }) ?? createInitialValues().lineValues;

  const preview = useMemo(
    () => buildHexagramPreview(lineValues.map((value) => Number(value) || 8)),
    [lineValues],
  );

  const displayLineEntries = useMemo(
    () => lineLabels.map((label, index) => ({ label, index })).slice().reverse(),
    [],
  );

  function updateLineValue(index: number, nextValue: number) {
    const nextLineValues = lineValues.map((value, currentIndex) =>
      currentIndex === index ? nextValue : Number(value) || 8,
    );

    form.setValue("method", "manual", { shouldDirty: true, shouldValidate: true });
    form.setValue("lineValues", nextLineValues, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function randomizeLines() {
    form.setValue("method", "coins", { shouldDirty: true, shouldValidate: true });
    form.setValue("lineValues", createCoinGeneratedLines(), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleSubmit(values: LiuyaoInputForm) {
    setSubmitError(null);

    startTransition(async () => {
      const response = await fetch("/api/divination/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setSubmitError(payload?.error ?? "起卦失败。");
        return;
      }

      const payload = (await response.json()) as { divination: { id: string } };
      router.push(`/divinations/${payload.divination.id}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-10">
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="space-y-6 rounded-xl p-5 shadow-none">
            <section className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">求测信息</h3>
                <p className="text-xs text-muted-foreground">先确定你想问什么，以及何时起卦。</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="subjectName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>求测人 *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="请输入姓名" className="h-9 rounded-md text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>性别</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-9 rounded-md text-sm">
                            <SelectValue placeholder="请选择性别" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">男</SelectItem>
                          <SelectItem value="female">女</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                          <SelectItem value="unknown">未知</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>所问之事 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="例如：这次合作是否适合继续推进？"
                        className="h-9 rounded-md text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="divinationDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>起卦日期 *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="h-9 rounded-md text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="divinationTime"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>起卦时间 *</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" className="h-9 rounded-md text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4 border-t border-border pt-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">手动起卦</h3>
                    <CircleHelp className="size-4 text-black/40" />
                  </div>
                  <p className="text-xs text-muted-foreground">点击中间爻位可在少阳、少阴、老阳、老阴四种状态间切换，右侧按钮可快速切换是否为变爻。</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-md px-3 text-sm"
                    onClick={randomizeLines}
                  >
                    <Coins className="size-3.5" />
                    铜钱摇卦
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.88fr)]">
                <div className="rounded-[1rem] border border-black/12 bg-white p-3">
                  <div className="mb-2">
                    <p className="text-xs font-medium tracking-[0.08em] text-black/40">卦象预设</p>
                  </div>

                  <div className="space-y-3">
                    {displayLineEntries.map(({ label, index }) => {
                      const currentValue = Number(lineValues[index]) || 8;
                      const meta = getLineMeta(currentValue);

                      return (
                        <div
                          key={label}
                          className="grid grid-cols-[3rem_minmax(0,8rem)_minmax(0,1fr)_4.5rem] items-center gap-3"
                        >
                          <span className="text-sm text-black/70">{label}</span>

                          <div className="relative">
                            <button
                              type="button"
                              className={`flex h-12 w-full items-center rounded-[0.85rem] border px-4 transition hover:border-black/30 ${getLineCardClass(currentValue)}`}
                              onClick={() => updateLineValue(index, cycleLineValue(currentValue))}
                            >
                              {renderLineStroke(currentValue)}
                            </button>
                            {meta.isMoving ? (
                              <span className="absolute -right-1.5 -top-1.5 rounded-full border border-white bg-black px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-sm">
                                变
                              </span>
                            ) : null}
                          </div>

                          <span className="text-base text-foreground">
                            {meta.label}
                            {meta.marker ? ` ${meta.marker}` : ""}
                          </span>

                          <Button
                            type="button"
                            variant={meta.isMoving ? "secondary" : "ghost"}
                            className={`h-9 rounded-xl px-0 text-sm font-semibold ${getChangeBadgeClass(currentValue)}`}
                            onClick={() => updateLineValue(index, toggleLineMoving(currentValue))}
                          >
                            变爻
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5 rounded-[1rem] border border-black/12 bg-white p-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium tracking-[0.08em] text-black/40">实时成卦</p>
                    <Badge variant="outline" className="rounded-full border-black/10 bg-white px-2 py-0.5 text-[10px] text-black/60">
                      {preview.movingLines.length ? `动爻 ${preview.movingLines.join("、")}` : "静卦"}
                    </Badge>
                  </div>

                  <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-[0.9rem] border border-black/10 bg-[#f8f8f6] px-4 py-5">
                    <div className="text-center">
                      <p className="text-[10px] tracking-[0.18em] text-black/45 uppercase">本卦</p>
                      <p className="mt-1 text-lg font-semibold tracking-[0.08em] text-foreground">
                        {preview.original.name}
                      </p>
                    </div>
                    <span className="text-[6.5rem] leading-none text-foreground md:text-[8rem]">
                      {getHexagramSymbol(preview.original.name)}
                    </span>
                    <p className="text-xs text-black/55">
                      {preview.original.upperTrigram}上{preview.original.lowerTrigram}下
                    </p>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="rounded-[0.9rem] border border-black/10 bg-white p-2">
                      <p className="text-[10px] tracking-[0.18em] text-black/45 uppercase">本卦含义</p>
                      <p className="mt-1 text-[11px] leading-4 text-black/68">{preview.original.description}</p>
                    </div>
                    <div className="rounded-[0.9rem] border border-black/10 bg-white p-2">
                      <p className="text-[10px] tracking-[0.18em] text-black/45 uppercase">变卦导向</p>
                      <p className="mt-1 text-[11px] leading-4 text-black/68">{preview.changed.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex flex-wrap gap-3">
                <Button className="h-11 flex-1 rounded-md" type="submit" disabled={isPending}>
                  {isPending ? "正在起卦..." : "开始起卦"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-md"
                  onClick={() => form.reset(createInitialValues())}
                >
                  <RefreshCcw className="size-4" />
                  重置
                </Button>
              </div>
              {submitError ? <p className="text-center text-sm text-fire">{submitError}</p> : null}
            </div>
          </Card>
        </form>
      </Form>

      <LiuyaoConceptSection />
    </div>
  );
}
