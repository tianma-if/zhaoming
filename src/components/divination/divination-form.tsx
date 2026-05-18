"use client";
import type { BirthPlaceSuggestion } from "@/components/divination/birth-place-input";
import { BirthPlaceInput } from "@/components/divination/birth-place-input";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  divinationType: "bazi",
  calendarType: "solar",
  birthDate: "",
  birthTime: "09:30",
  birthPlace: "",
  birthPlaceMeta: null as BirthPlaceSuggestion | null,
  gender: "male",
  subjectName: "",
  question: "请给我一份整体命盘解读。",
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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
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

  const selectedDate = form.birthDate ? new Date(`${form.birthDate}T00:00:00`) : undefined;
  const minBirthMonth = new Date(1900, 0, 1);
  const maxBirthMonth = new Date(new Date().getFullYear() + 1, 11, 1);
  const defaultCalendarMonth = selectedDate ?? new Date(1995, 0, 1);

  return (
    <div className="space-y-12">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="space-y-8 rounded-xl p-6 shadow-none">
          <section className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">基本信息</h3>
              <p className="text-sm text-muted-foreground">先填写最基础的身份信息。</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-3 text-sm">
                <span className="font-medium">姓名</span>
                <div className="space-y-2">
                  <Input
                    value={form.subjectName}
                    onChange={(event) => updateField("subjectName", event.target.value)}
                    placeholder="请输入姓名（可选）"
                    className="h-11 rounded-md"
                  />
                  <p className="text-sm text-muted-foreground">姓名仅用于记录，不影响排盘结果</p>
                </div>
              </label>

              <div className="grid gap-6">
                <label className="space-y-3 text-sm">
                  <span className="font-medium">性别 *</span>
                  <Select
                    value={form.gender}
                    onValueChange={(value) =>
                      updateField("gender", value as "male" | "female" | "other" | "unknown")
                    }
                  >
                    <SelectTrigger className="h-11 rounded-md">
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

          <section className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">时间信息</h3>
              <p className="text-sm text-muted-foreground">出生时间越准确，排盘结果越稳定。</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-3 text-sm">
                  <span className="font-medium">出生日期 *</span>
                  <Select
                    value={form.calendarType}
                    onValueChange={(value) => updateField("calendarType", value as "solar" | "lunar")}
                  >
                    <SelectTrigger className="h-11 rounded-md">
                      <SelectValue placeholder="请选择历法" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solar">阳历</SelectItem>
                      <SelectItem value="lunar">农历</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 w-full justify-between rounded-md font-normal"
                      >
                        <span className={cn(!selectedDate && "text-muted-foreground")}>
                          {selectedDate
                            ? format(selectedDate, "yyyy年MM月dd日", { locale: zhCN })
                            : "请选择出生日期"}
                        </span>
                        <CalendarIcon className="size-4 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto rounded-xl p-3" align="start">
                      <Calendar
                        mode="single"
                        locale={zhCN}
                        captionLayout="dropdown"
                        navLayout="around"
                        startMonth={minBirthMonth}
                        endMonth={maxBirthMonth}
                        defaultMonth={defaultCalendarMonth}
                        selected={selectedDate}
                        className="rounded-xl border bg-background"
                        onSelect={(date) => {
                          if (!date) {
                            return;
                          }
                          updateField("birthDate", format(date, "yyyy-MM-dd"));
                          setIsDatePickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3 text-sm">
                  <span className="font-medium">出生地点 *</span>
                  <BirthPlaceInput
                    value={form.birthPlace}
                    onChange={(value) => updateField("birthPlace", value)}
                    onSelectSuggestion={(suggestion) => updateField("birthPlaceMeta", suggestion)}
                    showLabel={false}
                    helperText={null}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="space-y-3 text-sm">
                  <span className="font-medium">出生时辰 *</span>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      type="time"
                      value={form.birthTime}
                      onChange={(event) => updateField("birthTime", event.target.value)}
                      required
                      className="h-11 rounded-md"
                    />
                    <div className="flex items-center rounded-md border border-border bg-muted/30 px-4 text-sm text-muted-foreground">
                      当前测算系统：八字
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    八字测算建议尽量提供准确出生时辰，越接近真实结果越稳定。
                  </p>
                </label>

                {form.calendarType === "lunar" ? (
                  <label className="flex items-center gap-3 rounded-md border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={form.isLeapMonth}
                      onChange={(event) => updateField("isLeapMonth", event.target.checked)}
                    />
                    当前日期为农历闰月
                  </label>
                ) : null}

              </div>
            </div>
          </section>

          <div className="space-y-3 border-t border-border pt-6">
            <Button className="h-11 w-full rounded-md" type="submit" disabled={isPending}>
              {isPending ? "正在计算..." : "开始计算八字"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              提交后将进入命盘与 AI 解读页面。
            </p>
            {error ? <p className="text-center text-sm text-fire">{error}</p> : null}
          </div>
        </Card>
      </form>

      {form.divinationType === "bazi" ? <BaziConceptSection /> : null}
    </div>
  );
}
