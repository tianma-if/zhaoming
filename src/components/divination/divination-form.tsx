"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DivinationBaseInfoForm } from "@/components/divination/divination-base-info-form";
import { DivinationRecordPrefillSheet } from "@/components/divination/divination-record-prefill-sheet";
import type { DivinationPrefillRecord } from "@/lib/divination/prefill";
import {
  divinationInputSchema,
  type DivinationInputForm,
} from "@/lib/divination/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

function createInitialValues(divinationType: DivinationInputForm["divinationType"]): DivinationInputForm {
  return {
  divinationType,
  calendarType: "solar",
  birthDate: "",
  birthTime: "09:30",
  birthPlace: "",
  birthPlaceMeta: null as DivinationInputForm["birthPlaceMeta"],
  gender: "male",
  subjectName: "",
  question: "请给我一份整体命盘解读。",
  isLeapMonth: false,
  };
}

const pillarConcepts = [
  {
    key: "year",
    shortLabel: "年",
    title: "年柱",
    description: "代表祖上、早年运势和社会关系，影响他人对你的第一印象。",
  },
  {
    key: "month",
    shortLabel: "月",
    title: "月柱",
    description: "代表父母、事业潜力和性格基础，是命盘里很重要的结构位置。",
  },
  {
    key: "day",
    shortLabel: "日",
    title: "日柱",
    description: "代表自我、性格核心和亲密关系，是整张命盘的观察中心。",
  },
  {
    key: "time",
    shortLabel: "时",
    title: "时柱",
    description: "代表子女、创造力、后期运势和人生逐渐展开的成果。",
  },
] as const;

const wuxingConcepts = [
  {
    element: "木",
    symbol: "🌳",
    description: "木代表生长、创造力和仁爱。",
    className: "",
    shellClassName:
      "border border-wood/10 bg-linear-to-br from-white via-[#f4fbf2] to-[#d8efcf] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_20px_-16px_rgba(89,130,73,0.45)]",
  },
  {
    element: "火",
    symbol: "🔥",
    description: "火代表热情、活力和变化。",
    className: "",
    shellClassName:
      "border border-fire/10 bg-linear-to-br from-white via-[#fff5ef] to-[#ffd8c8] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_20px_-16px_rgba(186,96,58,0.45)]",
  },
  {
    element: "土",
    symbol: "🌍",
    description: "土代表稳定、包容和承载力。",
    className: "",
    shellClassName:
      "border border-earth/10 bg-linear-to-br from-white via-[#f8f7ef] to-[#e7dfbf] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_20px_-16px_rgba(140,126,82,0.4)]",
  },
  {
    element: "金",
    symbol: "⚔️",
    description: "金代表果断、秩序和原则。",
    className: "",
    shellClassName:
      "border border-metal/10 bg-linear-to-br from-white via-[#f4f4f8] to-[#dddfea] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_20px_-16px_rgba(103,111,129,0.42)]",
  },
  {
    element: "水",
    symbol: "💧",
    description: "水代表智慧、流动和沟通。",
    className: "",
    shellClassName:
      "border border-water/10 bg-linear-to-br from-white via-[#eef8ff] to-[#d5e9fa] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_20px_-16px_rgba(72,118,154,0.42)]",
  },
] as const;

function BaziConceptSection() {
  return (
    <section className="space-y-10">
      <div className="space-y-4 text-center">
        <Badge>概念导读</Badge>
        <div className="space-y-3">
          <CardTitle className="text-4xl tracking-[0.06em] md:text-5xl">什么是八字？</CardTitle>
          <CardDescription className="mx-auto max-w-3xl text-base leading-8">
            八字也叫四柱命理，会把出生年、月、日、时组合成命盘，用来观察个性结构、
            阶段起伏与五行之间的动态关系。
          </CardDescription>
        </div>
      </div>

      <Card className="space-y-8 rounded-[2rem] bg-muted/45 px-6 py-8 shadow-none md:px-8">
        <div className="space-y-3 text-center">
          <CardTitle className="text-3xl tracking-[0.06em]">四柱详解</CardTitle>
          <CardDescription className="mx-auto max-w-2xl text-base leading-8">
            八字由四柱组成，每一柱都对应人生里不同的观察层次。
          </CardDescription>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillarConcepts.map((pillar) => (
            <article
              key={pillar.key}
              className="space-y-4 rounded-[1.5rem] border border-border bg-white p-6 shadow-[0_16px_32px_-30px_rgba(22,20,17,0.2)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-medium text-muted-foreground">
                {pillar.shortLabel}
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-3xl tracking-[0.04em]">{pillar.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{pillar.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <CardTitle className="text-3xl tracking-[0.06em] md:text-4xl">五行学说</CardTitle>
          <CardDescription className="mx-auto max-w-3xl text-base leading-8">
            八字分析也会看木、火、土、金、水之间的相生相克，不同元素的偏强偏弱，
            往往会影响一个人的表达方式和处事重心。
          </CardDescription>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {wuxingConcepts.map((item) => {
            return (
              <article
                key={item.element}
                className="space-y-4 rounded-[1.5rem] border border-border bg-white p-6 text-center shadow-[0_16px_32px_-30px_rgba(22,20,17,0.18)]"
              >
                <div className="flex justify-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-[1.15rem] ${item.shellClassName}`}
                  >
                    <span className={`text-[2rem] leading-none drop-shadow-[0_3px_6px_rgba(22,20,17,0.12)] ${item.className}`}>
                      {item.symbol}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-3xl tracking-[0.04em]">{item.element}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ZiweiConceptSection() {
  const features = [
    {
      title: "十二宫位",
      description: "围绕命宫、财帛、事业、夫妻等宫位关系，观察人生不同主题的重心分布。",
    },
    {
      title: "主星组合",
      description: "关注紫微、天府、武曲、廉贞等主星组合，帮助理解个性结构与人生驱动力。",
    },
    {
      title: "现代阅读",
      description: "保留传统斗数结构，同时用更清晰的卡片与文字呈现，降低阅读门槛。",
    },
  ] as const;

  return (
    <section className="space-y-8">
      <div className="space-y-4 text-center">
        <Badge>概念导读</Badge>
        <div className="space-y-3">
          <CardTitle className="text-4xl tracking-[0.06em] md:text-5xl">什么是紫微斗数？</CardTitle>
          <CardDescription className="mx-auto max-w-3xl text-base leading-8">
            紫微斗数会把个人信息映射到十二宫位与星曜组合中，用来观察人生主题、关系结构与阶段变化。
          </CardDescription>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((item) => (
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

function ChengguConceptSection() {
  const features = [
    {
      title: "四项定骨重",
      description: "按照农历出生年、月、日、时分别取值，再汇总成总骨重。",
    },
    {
      title: "轻量级切入",
      description: "相比八字和紫微，称骨更像一种快速读法，适合作为总体气质与人生节奏的概览。",
    },
    {
      title: "现代化呈现",
      description: "保留传统歌诀，同时补上拆分明细与更克制的结果表达，方便理解来源。",
    },
  ] as const;

  return (
    <section className="space-y-8">
      <div className="space-y-4 text-center">
        <Badge>概念导读</Badge>
        <div className="space-y-3">
          <CardTitle className="text-4xl tracking-[0.06em] md:text-5xl">什么是袁天罡称骨？</CardTitle>
          <CardDescription className="mx-auto max-w-3xl text-base leading-8">
            称骨算命会把出生的农历年、月、日、时换算成对应骨重，用总骨重和歌诀去看一生的总体基调。
          </CardDescription>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((item) => (
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

export function DivinationForm({
  divinationType = "bazi",
  submitLabel = "排盘",
  conceptSection,
  prefillRecords = [],
}: {
  divinationType?: DivinationInputForm["divinationType"];
  submitLabel?: string;
  conceptSection?: ReactNode;
  prefillRecords?: DivinationPrefillRecord[];
}) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<DivinationInputForm>({
    resolver: zodResolver(divinationInputSchema),
    defaultValues: createInitialValues(divinationType),
  });

  function handleSubmit(values: DivinationInputForm) {
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
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setSubmitError(payload?.error ?? "测算创建失败。");
        return;
      }

      const payload = (await response.json()) as { divination: { id: string } };
      router.push(`/divinations/${payload.divination.id}`);
      router.refresh();
    });
  }

  const calendarType = useWatch({ control: form.control, name: "calendarType" });
  const birthDate = useWatch({ control: form.control, name: "birthDate" });

  return (
    <div className="space-y-12">
      {prefillRecords.length ? (
        <div className="flex justify-end">
          <DivinationRecordPrefillSheet form={form} records={prefillRecords} />
        </div>
      ) : null}

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="space-y-8 rounded-xl p-6 shadow-none">
            <DivinationBaseInfoForm
              form={form}
              birthDate={birthDate}
              calendarType={calendarType}
              isDatePickerOpen={isDatePickerOpen}
              onDatePickerOpenChange={setIsDatePickerOpen}
            />

            <div className="space-y-3 border-t border-border pt-6">
              <Button className="h-11 w-full rounded-md" type="submit" disabled={isPending}>
                {isPending ? "正在排盘..." : submitLabel}
              </Button>
              {submitError ? <p className="text-center text-sm text-fire">{submitError}</p> : null}
            </div>
          </Card>
        </form>
      </Form>

      {conceptSection ??
        (divinationType === "bazi" ? (
          <BaziConceptSection />
        ) : divinationType === "chenggu" ? (
          <ChengguConceptSection />
        ) : null)}
    </div>
  );
}

export { BaziConceptSection, ChengguConceptSection, ZiweiConceptSection };
