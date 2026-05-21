"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Coins, Dices, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createCoinGeneratedLines } from "@/lib/divination/adapters/liuyao";
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
  { value: "6", label: "6 老阴", note: "阴爻，动" },
  { value: "7", label: "7 少阳", note: "阳爻，静" },
  { value: "8", label: "8 少阴", note: "阴爻，静" },
  { value: "9", label: "9 老阳", note: "阳爻，动" },
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
                  <p className="text-sm text-muted-foreground">可以手动录入六爻，也可以用铜钱法随机生成。</p>
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

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {lineLabels.map((label, index) => (
                  <FormField
                    key={label}
                    control={form.control}
                    name={`lineValues.${index}`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{label}</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-md">
                              <SelectValue placeholder="请选择爻值" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lineOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label} · {option.note}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>补充背景</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="可补充当前关系、时间节点、你的顾虑等，帮助 AI 更贴近问题本身。"
                        className="min-h-24 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">六爻数值说明</p>
                <p className="mt-2 leading-7">
                  6 为老阴，7 为少阳，8 为少阴，9 为老阳。老阴与老阳属于动爻，会参与变卦形成。
                </p>
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
