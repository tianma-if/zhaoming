"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Coins, Dices, RefreshCcw } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

const lineOptions = [
  { value: "6", label: "老阴", note: "阴爻，动" },
  { value: "7", label: "少阳", note: "阳爻，静" },
  { value: "8", label: "少阴", note: "阴爻，静" },
  { value: "9", label: "老阳", note: "阳爻，动" },
] as const;

const lineLabels = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;

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
  if (value === 6) return { yinYang: "yin", isMoving: true, label: "老阴" };
  if (value === 7) return { yinYang: "yang", isMoving: false, label: "少阳" };
  if (value === 8) return { yinYang: "yin", isMoving: false, label: "少阴" };
  return { yinYang: "yang", isMoving: true, label: "老阳" };
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

function YaoStroke({
  value,
  changed = false,
}: {
  value: number;
  changed?: boolean;
}) {
  const meta = getLineMeta(value);
  const isYang = changed
    ? value === 6 || value === 7
    : meta.yinYang === "yang";

  if (isYang) {
    return (
      <div className="h-[3px] w-full rounded-full bg-black" />
    );
  }

  return (
    <div className="grid grid-cols-[1fr_0.48fr_1fr] items-center gap-2">
      <div className="h-[3px] rounded-full bg-black" />
      <div className="h-px rounded-full bg-black/35" />
      <div className="h-[3px] rounded-full bg-black" />
    </div>
  );
}

function HexagramPreviewCard({
  title,
  name,
  subtitle,
  lineValues,
  changed = false,
}: {
  title: string;
  name: string;
  subtitle: string;
  lineValues: number[];
  changed?: boolean;
}) {
  const topDownLines = lineValues
    .map((value, index) => ({ value, label: lineLabels[index]! }))
    .slice()
    .reverse();

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-black/12 bg-white">
      <div className="border-b border-black/10 px-5 py-4">
        <p className="text-[11px] tracking-[0.24em] text-black/45 uppercase">{title}</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-[2.2rem] leading-none tracking-[0.04em] text-foreground">
              {name}
            </p>
            <p className="mt-2 text-sm text-black/55">{subtitle}</p>
          </div>
          <div className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/50">
            {changed ? "变卦" : "本卦"}
          </div>
        </div>
      </div>

      <div className="space-y-3 px-5 py-5">
        {topDownLines.map((line) => {
          const meta = getLineMeta(line.value);

          return (
            <div
              key={`${title}-${line.label}`}
              className={`grid grid-cols-[3.2rem_minmax(0,1fr)_4.5rem] items-center gap-3 rounded-xl px-2 py-1.5 ${
                meta.isMoving && !changed ? "bg-black text-white" : "bg-transparent"
              }`}
            >
              <span
                className={`text-[11px] tracking-[0.16em] ${
                  meta.isMoving && !changed ? "text-white/75" : "text-black/45"
                }`}
              >
                {line.label}
              </span>
              <YaoStroke value={line.value} changed={changed} />
              <span
                className={`text-right text-xs ${
                  meta.isMoving && !changed ? "text-white/80" : "text-black/50"
                }`}
              >
                {changed ? (meta.isMoving ? "已变" : "不变") : `${line.value} ${meta.label}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
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
      title: "先做基础版结构",
      description: "当前版本先提供起卦、本卦、变卦与动爻结果，后续再继续补纳甲、世应、六亲等专业层。",
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
    <div className="space-y-12">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="space-y-8 rounded-xl p-6 shadow-none">
            <section className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">求测信息</h3>
                <p className="text-sm text-muted-foreground">先确定你想问什么，以及何时起卦。</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="subjectName"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>求测人 *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="请输入姓名" className="h-11 rounded-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>性别</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-md">
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
                  <FormItem className="space-y-3">
                    <FormLabel>所问之事 *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="例如：这次合作是否适合继续推进？"
                        className="min-h-28 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="divinationDate"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>起卦日期 *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="h-11 rounded-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="divinationTime"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>起卦时间 *</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" className="h-11 rounded-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-6 border-t border-border pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">起卦方式</h3>
                  <p className="text-sm text-muted-foreground">左侧录入六爻，右侧实时查看本卦、变卦和动爻变化。</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-md"
                    onClick={() =>
                      form.setValue("method", "manual", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Dices className="size-4" />
                    手动输入
                  </Button>
                  <Button type="button" variant="outline" className="rounded-md" onClick={randomizeLines}>
                    <Coins className="size-4" />
                    铜钱摇卦
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                  {lineLabels.map((label, index) => (
                    <FormField
                      key={label}
                      control={form.control}
                      name={`lineValues.${index}`}
                      render={({ field }) => {
                        const value = Number(field.value);
                        const option = lineOptions.find((item) => Number(item.value) === value) ?? lineOptions[2];
                        const meta = getLineMeta(value);

                        return (
                          <FormItem className="space-y-3">
                            <FormLabel>{label}</FormLabel>
                            <div className="rounded-[1.1rem] border border-black/12 bg-white p-4">
                              <div className="mb-3 flex items-center gap-4">
                                <div className="min-w-24 text-sm font-medium text-foreground">
                                  {value} {option.label}
                                </div>
                                <div className="flex-1">
                                  <YaoStroke value={value} />
                                </div>
                                <div className="text-xs text-black/45">
                                  {meta.isMoving ? "动爻" : "静爻"}
                                </div>
                              </div>
                              <Select
                                value={String(field.value)}
                                onValueChange={(nextValue) => field.onChange(Number(nextValue))}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-md border-black/12 bg-white">
                                    <SelectValue placeholder="请选择爻值" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {lineOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.value} {item.label} · {item.note}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>

                <div className="space-y-4 rounded-[1.25rem] border border-black/12 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] tracking-[0.24em] text-black/45 uppercase">卦象预览</p>
                      <h4 className="text-2xl font-semibold tracking-tight text-foreground">实时成卦</h4>
                    </div>
                    <Badge variant="outline" className="rounded-full border-black/10 bg-white px-3 py-1 text-black/60">
                      {preview.movingLines.length ? `动爻 ${preview.movingLines.join("、")}` : "静卦"}
                    </Badge>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <HexagramPreviewCard
                      title="当前局势"
                      name={preview.original.name}
                      subtitle={`${preview.original.upperTrigram}上${preview.original.lowerTrigram}下`}
                      lineValues={lineValues.map((value) => Number(value) || 8)}
                    />
                    <HexagramPreviewCard
                      title="变化之后"
                      name={preview.changed.name}
                      subtitle={`${preview.changed.upperTrigram}上${preview.changed.lowerTrigram}下`}
                      lineValues={lineValues.map((value) => Number(value) || 8)}
                      changed
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1rem] border border-black/10 bg-white p-4">
                      <p className="text-[11px] tracking-[0.22em] text-black/45 uppercase">本卦含义</p>
                      <p className="mt-2 text-sm leading-7 text-black/68">{preview.original.description}</p>
                    </div>
                    <div className="rounded-[1rem] border border-black/10 bg-white p-4">
                      <p className="text-[11px] tracking-[0.22em] text-black/45 uppercase">变卦导向</p>
                      <p className="mt-2 text-sm leading-7 text-black/68">{preview.changed.description}</p>
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
