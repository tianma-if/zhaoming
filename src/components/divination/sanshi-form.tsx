"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Compass, Shield, Sparkles, TimerReset } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { saveDivinationPreview, type DivinationCreateResponse } from "@/lib/divination/preview";
import { sanshiInputSchema, type SanshiInputForm } from "@/lib/divination/schemas";
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

const systemOptions = [
  {
    value: "qimen",
    title: "奇门遁甲",
    description: "偏向时机与行动窗口，适合看这一步该不该推、怎么推。",
  },
  {
    value: "taiyi",
    title: "太乙神数",
    description: "偏向整体趋势与大局判断，适合先看方向是否站得住。",
  },
  {
    value: "liuren",
    title: "大六壬",
    description: "偏向人与事的互动关系，适合看沟通、合作、谈判与进退。",
  },
] as const;

const topicOptions = [
  { value: "career", label: "事业推进" },
  { value: "wealth", label: "财务合作" },
  { value: "relationship", label: "关系情感" },
  { value: "study", label: "学习考试" },
  { value: "travel", label: "出行迁动" },
  { value: "lawsuit", label: "谈判纠纷" },
  { value: "health", label: "健康调理" },
  { value: "general", label: "综合判断" },
] as const;

const taiyiCountOptions = [
  { value: "year", label: "年计", description: "偏看年度大势与长期方向。" },
  { value: "month", label: "月计", description: "偏看阶段节奏与月内推进。" },
  { value: "day", label: "日计", description: "偏看近日局势与短线判断。" },
  { value: "hour", label: "时计", description: "偏看当下窗口与即时动作。" },
] as const;

const principles = [
  {
    title: "统一入口",
    description: "先用一个表单承接三条流派，减少用户在术数选择上的犹豫成本。",
    icon: Compass,
  },
  {
    title: "策略导向",
    description: "优先回答这件事的时机、动作与边界，而不是空泛谈运势。",
    icon: Sparkles,
  },
  {
    title: "诚实边界",
    description: "当前版本先给简化局面摘要，不假装完整替代专业排盘。",
    icon: Shield,
  },
] as const;

function createInitialValues(): SanshiInputForm {
  const now = new Date();

  return {
    divinationType: "sanshi",
    system: "qimen",
    taiyiCountType: "hour",
    subjectName: "",
    gender: "unknown",
    question: "",
    divinationDate: format(now, "yyyy-MM-dd"),
    divinationTime: format(now, "HH:mm"),
    topic: "general",
    notes: "",
  };
}

export function SanshiForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<SanshiInputForm>({
    resolver: zodResolver(sanshiInputSchema),
    defaultValues: createInitialValues(),
  });
  const currentSystem = useWatch({
    control: form.control,
    name: "system",
  });

  function handleResetTime() {
    const now = new Date();
    form.setValue("divinationDate", format(now, "yyyy-MM-dd"), { shouldDirty: true });
    form.setValue("divinationTime", format(now, "HH:mm"), { shouldDirty: true });
  }

  function handleSubmit(values: SanshiInputForm) {
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
        setSubmitError(payload?.error ?? "测算创建失败。");
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
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">起局信息</CardTitle>
                  <CardDescription>
                    先选流派、问题主题与起局时间，系统会生成一份适合产品内阅读的三式简化摘要。
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleResetTime}
                >
                  <TimerReset className="size-4" />
                  使用当前时间
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {systemOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => form.setValue("system", option.value, { shouldDirty: true, shouldValidate: true })}
                    className={`rounded-2xl border p-4 text-left transition ${
                      currentSystem === option.value
                        ? "border-black bg-black text-white"
                        : "border-border bg-white hover:border-black/30"
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="font-medium">{option.title}</p>
                      <p
                        className={`text-sm leading-6 ${
                          currentSystem === option.value
                            ? "text-white/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {currentSystem === "taiyi" ? (
                <FormField
                  control={form.control}
                  name="taiyiCountType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>太乙计法</FormLabel>
                      <div className="grid gap-3 md:grid-cols-4">
                        {taiyiCountOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              form.setValue("taiyiCountType", option.value, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                            className={`rounded-2xl border p-4 text-left transition ${
                              field.value === option.value
                                ? "border-black bg-black text-white"
                                : "border-border bg-white hover:border-black/30"
                            }`}
                          >
                            <div className="space-y-2">
                              <p className="font-medium">{option.label}</p>
                              <p
                                className={`text-sm leading-6 ${
                                  field.value === option.value
                                    ? "text-white/80"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {option.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="subjectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>求测人</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：张三" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>性别</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择性别" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">男</SelectItem>
                          <SelectItem value="female">女</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                          <SelectItem value="unknown">不说明</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>问题主题</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择主题" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {topicOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="divinationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>起局日期</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="divinationTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>起局时间</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>你想判断什么？</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例如：这次换岗是否适合主动争取？如果推进，应该先找谁沟通？"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {submitError ? (
              <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {submitError}
              </p>
            ) : null}

            <Button className="h-11 w-full rounded-md" type="submit" disabled={isPending}>
              {isPending ? "正在起局..." : "排盘"}
            </Button>
          </Card>
        </form>
      </Form>

      <section className="space-y-8">
        <div className="space-y-4 text-center">
          <Badge>概念导读</Badge>
          <div className="space-y-3">
            <CardTitle className="text-4xl tracking-[0.06em] md:text-5xl">什么是三式占卜？</CardTitle>
            <CardDescription className="mx-auto max-w-3xl text-base leading-8">
              三式通常指奇门遁甲、太乙神数与大六壬。它们都更擅长处理“这件事现在怎么看、下一步怎么走、该防什么”这类时机与策略问题。
            </CardDescription>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="space-y-4 rounded-[1.5rem] border border-border bg-white p-6 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-3xl tracking-[0.04em]">{item.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
