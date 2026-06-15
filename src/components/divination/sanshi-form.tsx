"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { TimerReset } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { saveDivinationPreview, type DivinationCreateResponse } from "@/lib/divination/preview";
import { sanshiInputSchema, type SanshiInputForm } from "@/lib/divination/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const systemOptions = [
  {
    value: "qimen",
    title: "奇门遁甲",
    description: "【地式 · 奇门遁甲】定地利与主客博弈。擅捕捉时空交锋的行动窗口，研判当前局势该不该推、如何运筹。",
  },
  {
    value: "taiyi",
    title: "太乙神数",
    description: "【天式 · 太乙神数】观天时与大局周期。擅洞悉宏观气运的更迭演变，研判长远方向是否站得住脚。",
  },
  {
    value: "liuren",
    title: "大六壬",
    description: "【人式 · 大六壬】测人事与因缘流转。擅理清错综复杂的人际利益互动，研判日常事态的吉凶进退。",
  },
] as const;

const taiyiCountOptions = [
  { value: "year", label: "年计", description: "偏看年度大势与长期方向。" },
  { value: "month", label: "月计", description: "偏看阶段节奏与月内推进。" },
  { value: "day", label: "日计", description: "偏看近日局势与短线判断。" },
  { value: "hour", label: "时计", description: "偏看当下窗口与即时动作。" },
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
    </div>
  );
}
