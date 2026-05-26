"use client";

import { Check, Sparkles, WandSparkles } from "lucide-react";
import { CreditPackGrid } from "@/components/billing/credit-pack-grid";
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

const includedFeatures = [
  "新用户赠送 1 份 AI 分析报告",
  "1 次 = 生成 1 份完整 AI 报告",
  "排盘与基础命盘信息免费查看",
  "支付完成后，报告次数会自动入账到当前账户",
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
          <span className="group-data-[collapsible=icon]:hidden">解锁完整 AI 报告</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Badge variant="secondary" className="w-fit gap-1.5">
            <WandSparkles className="size-3.5" />
            AI 报告次数包
          </Badge>
          <DialogTitle>选择套餐后跳转到 Stripe 支付页</DialogTitle>
          <DialogDescription>
            注册赠送 1 次免费 AI 解读。用完后可继续按次购买，支付完成后次数会自动加到当前账户。
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

        <CreditPackGrid compact />

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
