"use client";

import { BadgeCheck, Check, Sparkles, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const creditPacks = [
  {
    name: "单次解读",
    price: "¥1.9",
    credits: "1 次",
    unitPrice: "¥1.9/次",
    description: "临时生成一份完整 AI 分析报告。",
  },
  {
    name: "灵感体验包",
    price: "¥6.9",
    credits: "5 次",
    unitPrice: "¥1.38/次",
    description: "适合先小范围体验不同命盘。",
  },
  {
    name: "常用解读包",
    price: "¥15.9",
    credits: "15 次",
    unitPrice: "¥1.06/次",
    description: "适合自己和亲友常用解读。",
    recommended: true,
  },
  {
    name: "深度探索包",
    price: "¥29.9",
    credits: "40 次",
    unitPrice: "¥0.75/次",
    description: "适合批量保存、对比和持续研究。",
  },
];

const includedFeatures = [
  "新用户赠送 1 份 AI 分析报告",
  "1 次 = 生成 1 份完整 AI 报告",
  "排盘与基础命盘信息免费查看",
  "报告次数长期保留，后续可接入支付后自动入账",
];

export function SubscriptionPlansDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 justify-start rounded-md bg-background shadow-none group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <Sparkles className="size-4" />
          <span className="group-data-[collapsible=icon]:hidden">解锁全部功能</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Badge variant="secondary" className="w-fit gap-1.5">
            <WandSparkles className="size-3.5" />
            AI 报告次数包
          </Badge>
          <DialogTitle>解锁完整 AI 命理分析报告</DialogTitle>
          <DialogDescription>
            注册赠送 1 次免费 AI 解读。用完后可按次购买，也可以选择次数包获得更低单次价格。
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-[1.25rem] border border-border bg-muted/35 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">免费权益</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                新用户首份 AI 分析报告免费，排盘与基础命盘信息保持开放。
              </p>
            </div>
            <Badge className="w-fit">赠送 1 次</Badge>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {creditPacks.map((pack) => (
            <div
              key={pack.name}
              className={cn(
                "relative flex min-h-[18rem] flex-col rounded-[1.25rem] border bg-card p-5 text-card-foreground shadow-[0_18px_44px_-34px_rgba(22,20,17,0.3)]",
                pack.recommended
                  ? "border-foreground ring-1 ring-foreground/10"
                  : "border-border",
              )}
            >
              {pack.recommended ? (
                <Badge className="absolute right-4 top-4 gap-1">
                  <BadgeCheck className="size-3.5" />
                  推荐
                </Badge>
              ) : null}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{pack.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {pack.description}
                  </p>
                </div>
                <div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-semibold tracking-tight">{pack.price}</span>
                    <span className="pb-1 text-sm text-muted-foreground">/ {pack.credits}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{pack.unitPrice}</p>
                </div>
              </div>
              <Button className="mt-auto w-full rounded-md" size="sm">
                选择套餐
              </Button>
            </div>
          ))}
        </div>

        <div className="grid gap-3 rounded-[1.25rem] border border-border bg-white/72 p-4 text-sm text-muted-foreground md:grid-cols-2">
          {includedFeatures.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
