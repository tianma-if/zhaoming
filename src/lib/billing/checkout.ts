import type { User } from "better-auth";
import { getCreditPack, getBillingPriceIdForPack } from "@/lib/billing/plans";
import { type BillingProvider } from "@/lib/billing/provider";
import { ensureUserProfile, getUserProfile, upsertBillingCheckoutSession } from "@/lib/data";
import {
  getAppBaseUrl,
  hasBillingCheckoutEnv,
  hasStripeSecretEnv,
} from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export type BillingCheckoutIntent = {
  provider: "stripe";
  mode: "redirect";
  checkoutUrl: string;
};

function getCheckoutSuccessUrl(credits: number) {
  const baseUrl = getAppBaseUrl() ?? "http://localhost:5555";
  return `${baseUrl}/divinations?purchase=success&credits=${credits}`;
}

export function normalizeReturnPath(returnPath?: string) {
  if (!returnPath?.startsWith("/") || returnPath.startsWith("//")) {
    return "/divinations";
  }

  return returnPath;
}

async function createStripeCheckoutIntent(input: {
  user: User;
  planId: string;
}): Promise<BillingCheckoutIntent> {
  if (!hasStripeSecretEnv()) {
    throw new Error("当前账单提供商尚未完成服务端密钥配置。");
  }

  const pack = getCreditPack(input.planId);

  if (!pack) {
    throw new Error("未找到对应的套餐。");
  }

  const priceId = getBillingPriceIdForPack("stripe", pack.id);

  if (!priceId) {
    throw new Error("当前套餐尚未绑定 Stripe Price，请先补全环境变量。");
  }

  await ensureUserProfile(input.user);
  const profile = await getUserProfile(input.user.id);

  const stripe = getStripe();
  const baseUrl = getAppBaseUrl() ?? "http://localhost:5555";
  const stripeCustomerId =
    profile?.billing_customer_id ??
    profile?.stripe_customer_id ??
    (
      await stripe.customers.create({
        email: input.user.email,
        name: input.user.name ?? undefined,
        metadata: {
          userId: input.user.id,
        },
      })
    ).id;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    billing_address_collection: "auto",
    customer: stripeCustomerId,
    client_reference_id: input.user.id,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      planId: pack.id,
      credits: String(pack.credits),
      userId: input.user.id,
    },
    payment_method_types: ["card"],
    success_url: `${getCheckoutSuccessUrl(pack.credits)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel?from=${encodeURIComponent(pack.id)}`,
  });

  if (!checkoutSession.url) {
    throw new Error("账单平台没有返回可跳转的支付链接。");
  }

  await upsertBillingCheckoutSession({
    provider: "stripe",
    sessionId: checkoutSession.id,
    userId: input.user.id,
    planId: pack.id,
    credits: pack.credits,
    amountTotal: pack.amount,
    currency: pack.currency,
    providerCustomerId: stripeCustomerId,
    providerPaymentReferenceId: null,
    providerStatus: checkoutSession.status ?? "open",
    paymentStatus: checkoutSession.payment_status ?? "unpaid",
  });

  return {
    provider: "stripe",
    mode: "redirect",
    checkoutUrl: checkoutSession.url,
  };
}

export async function createBillingCheckoutIntent(input: {
  user: User;
  planId: string;
  provider?: BillingProvider;
}) {
  if (!hasBillingCheckoutEnv()) {
    throw new Error("当前账单提供商尚未完成环境变量配置。");
  }

  return createStripeCheckoutIntent(input);
}
