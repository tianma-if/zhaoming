"use client";

import { Sparkles, WandSparkles } from "lucide-react";
import { CreditPackGrid } from "@/components/billing/credit-pack-grid";
import { FreeTierCard } from "@/components/billing/free-tier-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          <DialogDescription>
            注册赠送 1 次免费 AI 解读。用完后可继续按次购买，支付完成后次数会自动加到当前账户。
          </DialogDescription>
        </DialogHeader>

        <CreditPackGrid
          compact
          gridClassName="xl:grid-cols-4"
          leadingCard={<FreeTierCard compact />}
        />
      </DialogContent>
    </Dialog>
  );
}
