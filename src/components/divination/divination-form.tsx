"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  divinationType: "bazi",
  calendarType: "solar",
  birthDate: "",
  birthTime: "09:30",
  gender: "female",
  subjectName: "",
  question: "",
  isLeapMonth: false,
};

export function DivinationForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) {
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <Card className="space-y-8 rounded-[2.3rem] border-white/45 bg-white/50 p-7 md:p-9">
        <div className="space-y-3">
          <CardTitle className="text-4xl tracking-[0.06em] md:text-5xl">发起一张新命盘</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-8 md:text-base">
            先输入最必要的信息。知微会先生成标准化排盘，再进入 AI 阅读阶段。这里不急着给你结论，先把结构搭准确。
          </CardDescription>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <section className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.32em] text-muted-foreground">SYSTEM</p>
              <h3 className="font-display text-2xl tracking-[0.04em]">选择测算方式</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-muted-foreground">测算系统</span>
                <Select
                  value={form.divinationType}
                  onChange={(event) =>
                    updateField("divinationType", event.target.value as "bazi" | "ziwei")
                  }
                >
                  <option value="bazi">八字</option>
                  <option value="ziwei">紫微斗数</option>
                </Select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-muted-foreground">历法</span>
                <Select
                  value={form.calendarType}
                  onChange={(event) =>
                    updateField("calendarType", event.target.value as "solar" | "lunar")
                  }
                >
                  <option value="solar">公历</option>
                  <option value="lunar">农历</option>
                </Select>
              </label>
            </div>
          </section>

          <section className="space-y-4 border-t border-border/70 pt-6">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.32em] text-muted-foreground">IDENTITY</p>
              <h3 className="font-display text-2xl tracking-[0.04em]">基本信息</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-muted-foreground">称呼（可选）</span>
                <Input
                  value={form.subjectName}
                  onChange={(event) => updateField("subjectName", event.target.value)}
                  placeholder="例如：林女士"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-muted-foreground">性别</span>
                <Select
                  value={form.gender}
                  onChange={(event) =>
                    updateField(
                      "gender",
                      event.target.value as "male" | "female" | "other" | "unknown",
                    )
                  }
                >
                  <option value="female">女</option>
                  <option value="male">男</option>
                  <option value="other">其他</option>
                  <option value="unknown">未知</option>
                </Select>
              </label>
            </div>
          </section>

          <section className="space-y-4 border-t border-border/70 pt-6">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.32em] text-muted-foreground">BIRTH DATA</p>
              <h3 className="font-display text-2xl tracking-[0.04em]">出生信息</h3>
            </div>

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
              <label className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-white/50 px-4 py-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.isLeapMonth}
                  onChange={(event) => updateField("isLeapMonth", event.target.checked)}
                />
                农历闰月
              </label>
            ) : null}
          </section>

          <section className="space-y-4 border-t border-border/70 pt-6">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.32em] text-muted-foreground">INTENT</p>
              <h3 className="font-display text-2xl tracking-[0.04em]">你想理解什么</h3>
            </div>

            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">测算意图</span>
              <Textarea
                value={form.question}
                onChange={(event) => updateField("question", event.target.value)}
                placeholder="例如：我想看接下来一年事业选择的重心，以及我更适合稳住当前路径还是主动转向。"
                required
              />
            </label>
          </section>

          <div className="space-y-3 border-t border-border/70 pt-6">
            <Button className="w-full" size="lg" type="submit" disabled={isPending}>
              {isPending ? "正在排盘并进入阅读页…" : "开始排盘与解读"}
            </Button>
            <p className="text-sm leading-7 text-muted-foreground">
              提交后会进入结果页，展示命盘结构与 AI 解读。你不需要在这里等待长篇输出。
            </p>
            {error ? <p className="text-sm text-fire">{error}</p> : null}
          </div>
        </form>
      </Card>

      <div className="space-y-5">
        <Card className="space-y-4 rounded-[2rem] border-white/40 bg-white/36 p-5 shadow-none">
          <p className="text-xs tracking-[0.28em] text-muted-foreground">WORKFLOW</p>
          <div className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>1. 输入出生信息与问题。</p>
            <p>2. 后端生成标准化排盘 JSON。</p>
            <p>3. 进入单独阅读页查看命盘与解读。</p>
          </div>
        </Card>

        <Card className="space-y-4 rounded-[2rem] border-white/40 bg-white/36 p-5 shadow-none">
          <p className="text-xs tracking-[0.28em] text-muted-foreground">WHY THESE FIELDS</p>
          <p className="text-sm leading-7 text-muted-foreground">
            出生日期、时间、历法与性别会直接影响排盘结果。测算意图则决定 AI 更应该关注哪些结构线索。
          </p>
        </Card>

        <Card className="space-y-4 rounded-[2rem] border-white/40 bg-white/36 p-5 shadow-none">
          <p className="text-xs tracking-[0.28em] text-muted-foreground">CURRENT SCOPE</p>
          <p className="text-sm leading-7 text-muted-foreground">
            当前已接入八字与紫微斗数。后续会继续扩展奇门、梅花与更完整的积分付费体系。
          </p>
        </Card>
      </div>
    </div>
  );
}
