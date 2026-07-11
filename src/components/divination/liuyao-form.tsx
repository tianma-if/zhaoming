"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CircleHelp, Coins, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { createCoinGeneratedLines } from "@/lib/divination/adapters/liuyao";
import { getHexagramByLines } from "@/lib/divination/liuyao-hexagrams";
import { saveDivinationPreview, type DivinationCreateResponse } from "@/lib/divination/preview";
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
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/components/i18n-provider";

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

function getLineMeta(value: number, t: (key: string) => string) {
  if (value === 6) return { isYang: false, isMoving: true, label: t("divination.oldYin"), marker: "×" };
  if (value === 7) return { isYang: true, isMoving: false, label: t("divination.youngYang"), marker: "" };
  if (value === 8) return { isYang: false, isMoving: false, label: t("divination.youngYin"), marker: "" };
  return { isYang: true, isMoving: true, label: t("divination.oldYang"), marker: "○" };
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
  const isYang = value === 7 || value === 9;

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
  const { t } = useI18n();
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
        <Badge>{t("divination.concept")}</Badge>
        <div className="space-y-3">
          <CardTitle className="text-4xl tracking-[0.06em] md:text-5xl">{t("divination.liuyaoConcept")}</CardTitle>
          <CardDescription className="mx-auto max-w-3xl text-base leading-8">
            {t("concept.liuyao.intro")}
          </CardDescription>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="space-y-4 rounded-[1.5rem] border border-border bg-white p-6 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]"
          >
            <h3 className="font-display text-3xl tracking-[0.04em]">{t(item.title === "围绕具体问题起卦" ? "concept.liuyao.problemTitle" : item.title === "看现状，也看变化" ? "concept.liuyao.changeTitle" : "concept.liuyao.basicTitle")}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{t(item.title === "围绕具体问题起卦" ? "concept.liuyao.problem" : item.title === "看现状，也看变化" ? "concept.liuyao.change" : "concept.liuyao.basic")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LiuyaoForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showManualDivinationTime, setShowManualDivinationTime] = useState(false);
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

  function toggleManualDivinationTime(nextChecked: boolean) {
    if (nextChecked) {
      const now = new Date();
      form.setValue("divinationDate", format(now, "yyyy-MM-dd"));
      form.setValue("divinationTime", format(now, "HH:mm"));
    }

    setShowManualDivinationTime(nextChecked);
  }

  function handleSubmit(values: LiuyaoInputForm) {
    setSubmitError(null);
    const nextValues = showManualDivinationTime
      ? values
      : {
          ...values,
          divinationDate: format(new Date(), "yyyy-MM-dd"),
          divinationTime: format(new Date(), "HH:mm"),
        };

    startTransition(async () => {
      const response = await fetch("/api/divination/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextValues),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setSubmitError(payload?.error ?? t("divination.castFailed"));
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
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{t("divination.questionInfo")}</h3>
                <p className="text-xs text-muted-foreground">{t("divination.questionInfoHint")}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="subjectName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{t("divination.person")} *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("form.namePlaceholder")} className="h-9 rounded-md text-sm" />
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
                      <FormLabel>{t("form.gender")}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-9 rounded-md text-sm">
                            <SelectValue placeholder={t("form.genderPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">{t("form.male")}</SelectItem>
                          <SelectItem value="female">{t("form.female")}</SelectItem>
                          <SelectItem value="other">{t("form.other")}</SelectItem>
                          <SelectItem value="unknown">{t("form.unknown")}</SelectItem>
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
                      <FormLabel>{t("divination.question")} *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("divination.questionPlaceholder")}
                        className="h-9 rounded-md text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md border border-black/8 bg-white/60 px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{t("divination.manualTime")}</p>
                  <Switch
                    checked={showManualDivinationTime}
                    onCheckedChange={toggleManualDivinationTime}
                    aria-label={t("divination.manualTime")}
                  />
                </div>

                {showManualDivinationTime ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="divinationDate"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>{t("divination.castDate")} *</FormLabel>
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
                          <FormLabel>{t("divination.castTime")} *</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" className="h-9 rounded-md text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : null}
              </div>
            </section>

            <section className="space-y-4 border-t border-border pt-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">{t("divination.manualCast")}</h3>
                    <CircleHelp className="size-4 text-black/40" />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("divination.manualCastHint")}</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-md px-3 text-sm"
                    onClick={randomizeLines}
                  >
                    <Coins className="size-3.5" />
                    {t("divination.coinCast")}
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.88fr)]">
                <div className="rounded-[1rem] border border-black/12 bg-white p-3">
                  <div className="mb-2">
                    <p className="text-xs font-medium tracking-[0.08em] text-black/40">{t("divination.preset")}</p>
                  </div>

                  <div className="space-y-3">
                    {displayLineEntries.map(({ label, index }) => {
                      const currentValue = Number(lineValues[index]) || 8;
                      const meta = getLineMeta(currentValue, t);

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
                                {t("chart.changedLine")}
                              </span>
                            ) : null}
                          </div>

                          <span className="text-base text-foreground">
                            {meta.label}
                            {meta.marker ? ` ${meta.marker}` : ""}
                          </span>

                          <Button
                            type="button"
                            variant={meta.isMoving ? "outline" : "ghost"}
                            className={`h-9 rounded-xl px-0 text-sm font-semibold ${getChangeBadgeClass(currentValue)}`}
                            onClick={() => updateLineValue(index, toggleLineMoving(currentValue))}
                          >
                            {t("divination.movingLineLabel")}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5 rounded-[1rem] border border-black/12 bg-white p-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium tracking-[0.08em] text-black/40">{t("divination.liveResult")}</p>
                    <Badge variant="outline" className="rounded-full border-black/10 bg-white px-2 py-0.5 text-[10px] text-black/60">
                      {preview.movingLines.length ? `${t("divination.movingLines")} ${preview.movingLines.join("、")}` : t("divination.stillHexagram")}
                    </Badge>
                  </div>

                  <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-[0.9rem] border border-black/10 bg-[#f8f8f6] px-4 py-5">
                    <div className="text-center">
                      <p className="text-[10px] tracking-[0.18em] text-black/45 uppercase">{t("divination.originalHexagram")}</p>
                      <p className="mt-1 text-lg font-semibold tracking-[0.08em] text-foreground">
                        {preview.original.name}
                      </p>
                    </div>
                    <span className="text-[6.5rem] leading-none text-foreground md:text-[8rem]">
                      {getHexagramSymbol(preview.original.name)}
                    </span>
                    <p className="text-xs text-black/55">
                      {preview.original.upperTrigram} {t("divination.upperTrigram")} · {preview.original.lowerTrigram} {t("divination.lowerTrigram")}
                    </p>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="rounded-[0.9rem] border border-black/10 bg-white p-2">
                      <p className="text-[10px] tracking-[0.18em] text-black/45 uppercase">{t("divination.originalMeaning")}</p>
                      <p className="mt-1 text-[11px] leading-4 text-black/68">{preview.original.description}</p>
                    </div>
                    <div className="rounded-[0.9rem] border border-black/10 bg-white p-2">
                      <p className="text-[10px] tracking-[0.18em] text-black/45 uppercase">{t("divination.changedDirection")}</p>
                      <p className="mt-1 text-[11px] leading-4 text-black/68">{preview.changed.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex flex-wrap gap-3">
                <Button className="h-11 flex-1 rounded-md" type="submit" disabled={isPending}>
                  {isPending ? t("divination.casting") : t("divination.startCast")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-md"
                  onClick={() => form.reset(createInitialValues())}
                >
                  <RefreshCcw className="size-4" />
                  {t("records.reset")}
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
