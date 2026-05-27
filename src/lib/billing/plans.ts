import { getEnv } from "@/lib/env";
import type { BillingProvider } from "@/lib/billing/provider";

export type CreditPackId =
  | "single-report"
  | "popular-pack"
  | "deep-dive-pack";

export interface CreditPack {
  id: CreditPackId;
  name: string;
  priceLabel: string;
  creditsLabel: string;
  unitPriceLabel: string;
  description: string;
  credits: number;
  amount: number;
  currency: "cny";
  recommended?: boolean;
}

export const creditPacks: CreditPack[] = [
  {
    id: "single-report",
    name: "单次解读",
    priceLabel: "¥4.9",
    creditsLabel: "1 次",
    unitPriceLabel: "¥4.9 / 次",
    description: "临时生成 1 份完整 AI 命理分析报告。",
    credits: 1,
    amount: 490,
    currency: "cny",
  },
  {
    id: "popular-pack",
    name: "常用解读包",
    priceLabel: "¥15.9",
    creditsLabel: "15 次",
    unitPriceLabel: "¥1.06 / 次",
    description: "适合自己和亲友常用解读。",
    credits: 15,
    amount: 1590,
    currency: "cny",
    recommended: true,
  },
  {
    id: "deep-dive-pack",
    name: "深度探索包",
    priceLabel: "¥29.9",
    creditsLabel: "40 次",
    unitPriceLabel: "¥0.75 / 次",
    description: "适合批量保存、对比和持续研究。",
    credits: 40,
    amount: 2990,
    currency: "cny",
  },
];

const stripePriceEnvKeyByPlanId: Record<CreditPackId, keyof ReturnType<typeof getEnv>> = {
  "single-report": "STRIPE_PRICE_SINGLE_REPORT",
  "popular-pack": "STRIPE_PRICE_POPULAR_PACK",
  "deep-dive-pack": "STRIPE_PRICE_DEEP_DIVE_PACK",
};

const paddlePriceEnvKeyByPlanId: Record<CreditPackId, keyof ReturnType<typeof getEnv>> = {
  "single-report": "PADDLE_PRICE_SINGLE_REPORT",
  "popular-pack": "PADDLE_PRICE_POPULAR_PACK",
  "deep-dive-pack": "PADDLE_PRICE_DEEP_DIVE_PACK",
};

export function getCreditPack(planId: string) {
  return creditPacks.find((pack) => pack.id === planId) ?? null;
}

export function getStripePriceIdForPack(planId: CreditPackId) {
  const env = getEnv();
  const priceId = env[stripePriceEnvKeyByPlanId[planId]];

  return typeof priceId === "string" ? priceId : null;
}

export function getPaddlePriceIdForPack(planId: CreditPackId) {
  const env = getEnv();
  const priceId = env[paddlePriceEnvKeyByPlanId[planId]];

  return typeof priceId === "string" ? priceId : null;
}

export function getBillingPriceIdForPack(provider: BillingProvider, planId: CreditPackId) {
  return provider === "paddle" ? getPaddlePriceIdForPack(planId) : getStripePriceIdForPack(planId);
}
