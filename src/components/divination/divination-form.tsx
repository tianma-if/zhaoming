"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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

export function DivinationForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const submitLabel =
    form.divinationType === "ziwei" ? "开始计算紫微斗数" : "开始计算八字";

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
        <form className="space-y-8" onSubmit={handleSubmit} aria-busy={isPending}>
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
                    autoComplete="name"
                  />
                </label>

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
                      <option value="male">男</option>
                      <option value="female">女</option>
                      <option value="other">其他</option>
                      <option value="unknown">未知</option>
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
                    onChange={(event) =>
                      updateField("calendarType", event.target.value as "solar" | "lunar")
                    }
                  >
                    <option value="solar">公历</option>
                    <option value="lunar">农历</option>
                  </Select>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="text-muted-foreground">出生日期 *</span>
                    <Input
                      type="date"
                      value={form.birthDate}
                      onChange={(event) => updateField("birthDate", event.target.value)}
                      required
                      aria-invalid={error ? true : undefined}
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="text-muted-foreground">出生时间 *</span>
                    <Input
                      type="time"
                      value={form.birthTime}
                      onChange={(event) => updateField("birthTime", event.target.value)}
                      required
                      aria-invalid={error ? true : undefined}
                    />
                  </label>
                </div>

                {form.calendarType === "lunar" ? (
                  <div className="space-y-2 rounded-2xl border border-border bg-white/68 px-4 py-3">
                    <label className="flex items-center gap-3 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={form.isLeapMonth}
                        onChange={(event) => updateField("isLeapMonth", event.target.checked)}
                      />
                      农历闰月
                    </label>
                    <p className="text-xs leading-6 text-muted-foreground">
                      仅当你的农历出生月份本身是闰月时勾选；如果不确定，可以先不勾选。
                    </p>
                  </div>
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
              <span className="text-muted-foreground">问题描述 *</span>
              <Textarea
                value={form.question}
                onChange={(event) => updateField("question", event.target.value)}
                placeholder="例如：我想看接下来一年事业方向是否适合调整，以及关系中的核心矛盾在哪里。"
                required
                aria-invalid={error ? true : undefined}
              />
            </label>
          </section>

          <div className="space-y-3">
            <Button className="w-full" size="lg" type="submit" disabled={isPending}>
              {isPending ? "正在生成命盘与解读入口..." : submitLabel}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              提交后将进入命盘与 AI 解读页面。
            </p>
            {error ? (
              <p className="text-center text-sm text-fire" role="alert" aria-live="polite">
                {error} 请检查出生信息后重试。
              </p>
            ) : null}
          </div>
        </form>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="space-y-3 rounded-[1.4rem] border border-border bg-white p-5 shadow-[0_14px_28px_-28px_rgba(22,20,17,0.1)]">
          <Badge>输入项</Badge>
          <CardTitle className="text-2xl">为什么要出生时间</CardTitle>
          <CardDescription className="text-sm leading-7">
            出生时间会直接影响时柱变化，因此会影响对性格结构与阶段起伏的判断。
          </CardDescription>
        </Card>
        <Card className="space-y-3 rounded-[1.4rem] border border-border bg-white p-5 shadow-[0_14px_28px_-28px_rgba(22,20,17,0.1)]">
          <Badge>流程</Badge>
          <CardTitle className="text-2xl">先排盘，再解读</CardTitle>
          <CardDescription className="text-sm leading-7">
            我们不会直接生成一段空泛文案，而是先得到结构化命盘，再进入解释过程。
          </CardDescription>
        </Card>
        <Card className="space-y-3 rounded-[1.4rem] border border-border bg-white p-5 shadow-[0_14px_28px_-28px_rgba(22,20,17,0.1)]">
          <Badge>当前支持</Badge>
          <CardTitle className="text-2xl">八字与紫微</CardTitle>
          <CardDescription className="text-sm leading-7">
            当前工作台已支持八字与紫微斗数，后续会继续扩展更多命理系统。
          </CardDescription>
        </Card>
      </div>
    </div>
  );
}
