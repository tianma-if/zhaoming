"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarClock, Hash, RefreshCcw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getHexagramByLines } from "@/lib/divination/liuyao-hexagrams";
import { saveDivinationPreview, type DivinationCreateResponse } from "@/lib/divination/preview";
import { meihuaInputSchema, type MeihuaInputForm } from "@/lib/divination/schemas";
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

const trigrams = [
  { number: 1, name: "乾", nature: "天", code: "111" },
  { number: 2, name: "兑", nature: "泽", code: "110" },
  { number: 3, name: "离", nature: "火", code: "101" },
  { number: 4, name: "震", nature: "雷", code: "100" },
  { number: 5, name: "巽", nature: "风", code: "011" },
  { number: 6, name: "坎", nature: "水", code: "010" },
  { number: 7, name: "艮", nature: "山", code: "001" },
  { number: 8, name: "坤", nature: "地", code: "000" },
] as const;

function createInitialValues(): MeihuaInputForm {
  const now = new Date();

  return {
    divinationType: "meihua",
    method: "time",
    subjectName: "",
    gender: "unknown",
    question: "",
    divinationDate: format(now, "yyyy-MM-dd"),
    divinationTime: format(now, "HH:mm"),
    upperNumber: 1,
    lowerNumber: 2,
    movingNumber: undefined,
    notes: "",
  };
}

function normalizeModulo(value: number, modulo: number) {
  return ((value - 1) % modulo) + 1;
}

function getTrigram(value: number) {
  return trigrams[normalizeModulo(value || 1, 8) - 1]!;
}

function getLines(upperCode: string, lowerCode: string) {
  return [...lowerCode, ...upperCode].map((value) => (value === "1" ? 1 : 0));
}

function flipLine(lines: number[], movingLine: number) {
  return lines.map((value, index) => (index === movingLine - 1 ? (value ? 0 : 1) : value));
}

function buildPreview(upperNumber?: number, lowerNumber?: number, movingNumber?: number) {
  const upper = getTrigram(Number(upperNumber) || 1);
  const lower = getTrigram(Number(lowerNumber) || 1);
  const movingLine = normalizeModulo(Number(movingNumber) || Number(upperNumber) + Number(lowerNumber) || 1, 6);
  const baseLines = getLines(upper.code, lower.code);

  return {
    upper,
    lower,
    movingLine,
    original: getHexagramByLines(baseLines),
    changed: getHexagramByLines(flipLine(baseLines, movingLine)),
  };
}

function MethodOption({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex min-h-24 items-start gap-3 rounded-md border p-4 text-left transition ${
        active ? "border-black bg-black text-white" : "border-border bg-white hover:border-black/30"
      }`}
      onClick={onClick}
    >
      <span className={active ? "text-white" : "text-black/70"}>{icon}</span>
      <span className="space-y-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className={active ? "block text-xs leading-5 text-white/72" : "block text-xs leading-5 text-muted-foreground"}>
          {description}
        </span>
      </span>
    </button>
  );
}

function MeihuaConceptSection() {
  const items = [
    {
      title: "以象数入局",
      description: "梅花易数重在从时间、数字、外应等线索入卦，适合围绕当下具体事项快速判断变化方向。",
    },
    {
      title: "本互变三层",
      description: "本卦看当前格局，互卦看内在过程，变卦看后续转折，动爻用于定位关键变化点。",
    },
    {
      title: "体用看关系",
      description: "系统会根据动爻区分体卦与用卦，并给出五行生克关系，作为后续 AI 解读的结构化依据。",
    },
  ] as const;

  return (
    <section className="space-y-8">
      <div className="space-y-4 text-center">
        <Badge>概念导读</Badge>
        <div className="space-y-3">
          <CardTitle className="text-4xl tracking-tight md:text-5xl">什么是梅花易数？</CardTitle>
          <CardDescription className="mx-auto max-w-3xl text-base leading-8">
            梅花易数偏重“触机而占”，通过象、数与时间建立卦象，再从本卦、互卦、变卦和体用关系中观察事情的状态与趋势。
          </CardDescription>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="space-y-3 rounded-md border border-border bg-white p-5">
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MeihuaForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<MeihuaInputForm>({
    resolver: zodResolver(meihuaInputSchema),
    defaultValues: createInitialValues(),
  });
  const method = useWatch({ control: form.control, name: "method" });
  const upperNumber = useWatch({ control: form.control, name: "upperNumber" });
  const lowerNumber = useWatch({ control: form.control, name: "lowerNumber" });
  const movingNumber = useWatch({ control: form.control, name: "movingNumber" });
  const preview = useMemo(
    () => buildPreview(Number(upperNumber), Number(lowerNumber), Number(movingNumber)),
    [lowerNumber, movingNumber, upperNumber],
  );

  function handleSubmit(values: MeihuaInputForm) {
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

      const payload = (await response.json()) as DivinationCreateResponse;

      if (!payload.persisted) {
        saveDivinationPreview(payload.divination);
        router.push("/divinations/preview");
        return;
      }

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
                <p className="text-xs text-muted-foreground">先写清楚所问之事，再选择起卦方式。</p>
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
            </section>

            <section className="space-y-4 border-t border-border pt-5">
              <div className="grid gap-3 md:grid-cols-2">
                <MethodOption
                  active={method === "time"}
                  icon={<CalendarClock className="size-4" />}
                  title="时间起卦"
                  description="按当前或指定起卦时间取农历年月日时数。"
                  onClick={() => form.setValue("method", "time", { shouldDirty: true, shouldValidate: true })}
                />
                <MethodOption
                  active={method === "number"}
                  icon={<Hash className="size-4" />}
                  title="数字起卦"
                  description="手动输入上卦数、下卦数，可选动爻数。"
                  onClick={() => form.setValue("method", "number", { shouldDirty: true, shouldValidate: true })}
                />
              </div>

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

              {method === "number" ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="upperNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>上卦数字 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={typeof field.value === "number" ? field.value : ""}
                            onChange={(event) =>
                              field.onChange(event.target.value ? Number(event.target.value) : undefined)
                            }
                            type="number"
                            min={1}
                            className="h-9 rounded-md text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lowerNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>下卦数字 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={typeof field.value === "number" ? field.value : ""}
                            onChange={(event) =>
                              field.onChange(event.target.value ? Number(event.target.value) : undefined)
                            }
                            type="number"
                            min={1}
                            className="h-9 rounded-md text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="movingNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>动爻数字</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={typeof field.value === "number" ? field.value : ""}
                            onChange={(event) =>
                              field.onChange(event.target.value ? Number(event.target.value) : undefined)
                            }
                            type="number"
                            min={1}
                            placeholder="默认上+下"
                            className="h-9 rounded-md text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}
            </section>

            {method === "number" ? (
              <section className="grid gap-3 rounded-md border border-black/10 bg-white p-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">本卦</p>
                  <p className="text-lg font-semibold">{preview.original.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {preview.upper.name}上{preview.lower.name}下
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">变卦</p>
                  <p className="text-lg font-semibold">{preview.changed.name}</p>
                  <p className="text-xs text-muted-foreground">动爻：第 {preview.movingLine} 爻</p>
                </div>
                <div className="flex items-center justify-start md:justify-end">
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    {preview.upper.nature} / {preview.lower.nature}
                  </Badge>
                </div>
              </section>
            ) : null}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>补充背景</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="可补充外应、场景、相关人物或你已经观察到的变化。"
                      className="min-h-24 rounded-md text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex flex-wrap gap-3">
                <Button className="h-11 flex-1 rounded-md" type="submit" disabled={isPending}>
                  <Sparkles className="size-4" />
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

      <MeihuaConceptSection />
    </div>
  );
}
