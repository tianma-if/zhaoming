import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getCreditPack, getStripePriceIdForPack } from "@/lib/billing/plans";
import { ensureUserProfile, getUserProfile, upsertStripeCheckoutSession } from "@/lib/data";
import { getAppBaseUrl, hasStripeCheckoutEnv, hasStripeSecretEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

const requestSchema = z.object({
  planId: z.string().min(1),
  returnPath: z.string().optional(),
});

function normalizeReturnPath(returnPath?: string) {
  if (!returnPath?.startsWith("/") || returnPath.startsWith("//")) {
    return "/pricing";
  }

  return returnPath;
}

export async function POST(request: Request) {
  try {
    if (!hasStripeSecretEnv() || !hasStripeCheckoutEnv()) {
      return NextResponse.json(
        { error: "Stripe 尚未完成环境变量配置。" },
        { status: 503 },
      );
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user ?? null;
    const { planId, returnPath } = requestSchema.parse(await request.json());

    if (!user) {
      return NextResponse.json(
        {
          error: "请先登录，再继续支付。",
          loginUrl: `/login?callbackURL=${encodeURIComponent(normalizeReturnPath(returnPath))}`,
        },
        { status: 401 },
      );
    }

    const pack = getCreditPack(planId);

    if (!pack) {
      return NextResponse.json({ error: "未找到对应的套餐。" }, { status: 400 });
    }

    const priceId = getStripePriceIdForPack(pack.id);

    if (!priceId) {
      return NextResponse.json(
        { error: "当前套餐尚未绑定 Stripe Price，请先补全环境变量。" },
        { status: 503 },
      );
    }

    await ensureUserProfile(user);
    const profile = await getUserProfile(user.id);

    const stripe = getStripe();
    const baseUrl = getAppBaseUrl() ?? "http://localhost:5555";
    const stripeCustomerId =
      profile?.stripe_customer_id ??
      (
        await stripe.customers.create({
          email: user.email,
          name: user.name ?? undefined,
          metadata: {
            userId: user.id,
          },
        })
      ).id;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "auto",
      customer: stripeCustomerId,
      client_reference_id: user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        planId: pack.id,
        credits: String(pack.credits),
        userId: user.id,
      },
      payment_method_types: ["card"],
      success_url: `${baseUrl}/divinations?purchase=success&credits=${pack.credits}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel?from=${encodeURIComponent(pack.id)}`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe 没有返回可跳转的支付链接。" },
        { status: 502 },
      );
    }

    await upsertStripeCheckoutSession({
      sessionId: checkoutSession.id,
      userId: user.id,
      planId: pack.id,
      credits: pack.credits,
      amountTotal: pack.amount,
      currency: pack.currency,
      stripeCustomerId,
      stripeStatus: checkoutSession.status ?? "open",
      paymentStatus: checkoutSession.payment_status ?? "unpaid",
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout creation failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "创建支付订单失败。",
      },
      { status: 500 },
    );
  }
}
