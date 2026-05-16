"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  divinationType: "bazi",
  calendarType: "solar",
  birthDate: "",
  birthTime: "09:30",
  gender: "male",
  subjectName: "",
  question: "",
  isLeapMonth: false,
};

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

export function DivinationForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof typeof initialState>(
    key: K,
    value: (typeof initialState)[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/divination/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "测算创建失败。");
        return;
      }

      const payload = (await response.json()) as { divination: { id: string } };
      router.push(`/divinations/${payload.divination.id}`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-14">
      <Card className="rounded-[1.75rem] border border-border bg-white p-6 shadow-[0_18px_36px_-32px_rgba(22,20,17,0.12)] md:p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-10 lg:grid-cols-2">
            <section className="space-y-5">
              <div className="space-y-1">
                <Badge>基本信息</Badge>
                <CardTitle className="text-3xl tracking-[0.04em]">输入对象信息</CardTitle>
              </div>

              <div className="space-y-4">
                <label className="space-y-2 text-sm">
                  <span className="text-muted-foreground">姓名或称呼</span>
                  <Input
                    value={form.subjectName}
                    onChange={(event) => updateField("subjectName", event.target.value)}
                    placeholder="请输入姓名或称呼"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="text-muted-foreground">测算系统</span>
                    <Select
                      value={form.divinationType}
                      onValueChange={(value) =>
                        updateField("divinationType", value as "bazi" | "ziwei")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择测算系统" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bazi">八字</SelectItem>
                        <SelectItem value="ziwei">紫微斗数</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="text-muted-foreground">性别</span>
                    <Select
                      value={form.gender}
                      onValueChange={(value) =>
                        updateField("gender", value as "male" | "female" | "other" | "unknown")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                        <SelectItem value="unknown">未知</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="space-y-1">
                <Badge>时间信息</Badge>
                <CardTitle className="text-3xl tracking-[0.04em]">填写出生时间</CardTitle>
              </div>

              <div className="space-y-4">
                <label className="space-y-2 text-sm">
                  <span className="text-muted-foreground">历法</span>
                  <Select
                    value={form.calendarType}
                    onValueChange={(value) =>
                      updateField("calendarType", value as "solar" | "lunar")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择历法" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solar">公历</SelectItem>
                      <SelectItem value="lunar">农历</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="text-muted-foreground">出生日期</span>
                    <Input
                      type="date"
                      value={form.birthDate}
                      onChange={(event) => updateField("birthDate", event.target.value)}
                      required
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="text-muted-foreground">出生时间</span>
                    <Input
                      type="time"
                      value={form.birthTime}
                      onChange={(event) => updateField("birthTime", event.target.value)}
                      required
                    />
                  </label>
                </div>

                {form.calendarType === "lunar" ? (
                  <label className="flex items-center gap-3 rounded-xl border border-border bg-white/68 px-4 py-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={form.isLeapMonth}
                      onChange={(event) => updateField("isLeapMonth", event.target.checked)}
                    />
                    农历闰月
                  </label>
                ) : null}
              </div>
            </section>
          </div>

          <Separator />

          <section className="space-y-5">
            <div className="space-y-1">
              <Badge>测算意图</Badge>
              <CardTitle className="text-3xl tracking-[0.04em]">你想看什么</CardTitle>
              <CardDescription className="text-sm leading-7">
                输入你真正想弄清楚的问题，AI 会围绕这部分重点展开解释。
              </CardDescription>
            </div>

            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">问题描述</span>
              <Textarea
                value={form.question}
                onChange={(event) => updateField("question", event.target.value)}
                placeholder="例如：我想看接下来一年事业方向是否适合调整，以及关系中的核心矛盾在哪里。"
                required
              />
            </label>
          </section>

          <div className="space-y-3">
            <Button className="w-full" size="lg" type="submit" disabled={isPending}>
              {isPending ? "正在计算..." : "开始计算八字"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              提交后将进入命盘与 AI 解读页面。
            </p>
            {error ? <p className="text-center text-sm text-fire">{error}</p> : null}
          </div>
        </form>
      </Card>

      {form.divinationType === "bazi" ? <BaziConceptSection /> : null}
    </div>
  );
}
