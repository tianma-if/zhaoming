"use client";

import { useState, useTransition } from "react";
import type { BaziChart, ZiweiChart } from "@/types/divination";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BaziChartView } from "./bazi-chart";
import { ZiweiChartView } from "./ziwei-chart";
import { AiReadingPanel } from "./ai-reading-panel";

interface DivinationPayload {
  id: string;
  divination_type: "bazi" | "ziwei";
  question: string;
  chart_json: BaziChart | ZiweiChart;
}

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
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState<DivinationPayload | null>(null);
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

      const payload = (await response.json()) as { divination: DivinationPayload };
      setResult(payload.divination);
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card className="space-y-5">
        <div className="space-y-2">
          <CardTitle>发起测算</CardTitle>
          <CardDescription>
            先生成结构化排盘 JSON，再作为上下文交给大模型进行自然语言解读。
          </CardDescription>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <div className="grid gap-4 md:grid-cols-2">
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
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">称呼（可选）</span>
              <Input
                value={form.subjectName}
                onChange={(event) => updateField("subjectName", event.target.value)}
                placeholder="例如：林女士"
              />
            </label>
          </div>

          {form.calendarType === "lunar" ? (
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isLeapMonth}
                onChange={(event) => updateField("isLeapMonth", event.target.checked)}
              />
              农历闰月
            </label>
          ) : null}

          <label className="space-y-2 text-sm">
            <span className="text-muted-foreground">测算意图</span>
            <Textarea
              value={form.question}
              onChange={(event) => updateField("question", event.target.value)}
              placeholder="例如：我想看接下来一年事业选择的重心，以及我更适合稳住当前路径还是主动转向。"
              required
            />
          </label>

          <Button className="w-full" size="lg" type="submit" disabled={isPending}>
            {isPending ? "正在排盘…" : "生成排盘并开始解读"}
          </Button>

          {error ? <p className="text-sm text-fire">{error}</p> : null}
        </form>
      </Card>

      <div className="space-y-6">
        {result ? (
          <>
            {result.divination_type === "bazi" ? (
              <BaziChartView chart={result.chart_json as BaziChart} />
            ) : (
              <ZiweiChartView chart={result.chart_json as ZiweiChart} />
            )}
            <AiReadingPanel divinationId={result.id} question={result.question} />
          </>
        ) : (
          <Card className="flex min-h-[28rem] items-center justify-center">
            <p className="max-w-md text-center text-sm leading-8 text-muted-foreground">
              这里会显示结构化排盘和 AI 解盘结果。当前第一阶段已经接好八字与紫微的基础数据流，后续可以继续叠加奇门、梅花、付费和自动化博客。
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
