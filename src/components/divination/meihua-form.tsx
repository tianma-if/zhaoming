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
import { useI18n } from "@/components/i18n-provider";

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
  const { t } = useI18n();
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
        <Badge>{t("divination.concept")}</Badge>
        <div className="space-y-3">
          <CardTitle className="text-4xl tracking-tight md:text-5xl">{t("divination.meihuaConcept")}</CardTitle>
          <CardDescription className="mx-auto max-w-3xl text-base leading-8">
            {t("concept.meihua.intro")}
          </CardDescription>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="space-y-3 rounded-md border border-border bg-white p-5">
            <h3 className="text-lg font-semibold text-foreground">{t(item.title === "以象数入局" ? "concept.meihua.imageTitle" : item.title === "本互变三层" ? "concept.meihua.layersTitle" : "concept.meihua.bodyTitle")}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{t(item.title === "以象数入局" ? "concept.meihua.image" : item.title === "本互变三层" ? "concept.meihua.layers" : "concept.meihua.body")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MeihuaForm() {
  const { t } = useI18n();
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
            </section>

            <section className="space-y-4 border-t border-border pt-5">
              <div className="grid gap-3 md:grid-cols-2">
                <MethodOption
                  active={method === "time"}
                  icon={<CalendarClock className="size-4" />}
                  title={t("divination.timeCast")}
                  description={t("divination.timeCastHint")}
                  onClick={() => form.setValue("method", "time", { shouldDirty: true, shouldValidate: true })}
                />
                <MethodOption
                  active={method === "number"}
                  icon={<Hash className="size-4" />}
                  title={t("divination.numberCast")}
                  description={t("divination.numberCastHint")}
                  onClick={() => form.setValue("method", "number", { shouldDirty: true, shouldValidate: true })}
                />
              </div>

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

              {method === "number" ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="upperNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>{t("divination.upperNumber")} *</FormLabel>
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
                        <FormLabel>{t("divination.lowerNumber")} *</FormLabel>
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
                        <FormLabel>{t("divination.movingNumber")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={typeof field.value === "number" ? field.value : ""}
                            onChange={(event) =>
                              field.onChange(event.target.value ? Number(event.target.value) : undefined)
                            }
                            type="number"
                            min={1}
                            placeholder={t("divination.defaultSum")}
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
                  <p className="text-xs text-muted-foreground">{t("divination.originalHexagram")}</p>
                  <p className="text-lg font-semibold">{preview.original.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {preview.upper.name}上{preview.lower.name}下
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("divination.changedDirection")}</p>
                  <p className="text-lg font-semibold">{preview.changed.name}</p>
                  <p className="text-xs text-muted-foreground">{t("divination.movingLine", { number: preview.movingLine })}</p>
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
                  <FormLabel>{t("divination.background")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("divination.backgroundPlaceholder")}
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

      <MeihuaConceptSection />
    </div>
  );
}
