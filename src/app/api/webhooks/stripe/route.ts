import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCreditPack } from "@/lib/billing/plans";
import { fulfillStripeCheckoutSession } from "@/lib/data";
import { getEnv, hasStripeWebhookEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

function getPaymentIntentId(paymentIntent: string | Stripe.PaymentIntent | null) {
  if (!paymentIntent) {
    return null;
  }

  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

export async function POST(request: Request) {
  try {
    if (!hasStripeWebhookEnv()) {
      return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
    }

    const env = getEnv();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
    }

    const body = await request.text();
    const stripe = getStripe();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Invalid Stripe signature.",
        },
        { status: 400 },
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const planId = session.metadata?.planId ?? "";
      const userId = session.metadata?.userId ?? "";
      const pack = getCreditPack(planId);
      const credits = Number(session.metadata?.credits ?? 0);

      if (!pack || !userId || !Number.isFinite(credits) || credits <= 0) {
        return NextResponse.json(
          { error: "Missing checkout metadata required for fulfillment." },
          { status: 400 },
        );
      }

      await fulfillStripeCheckoutSession({
        sessionId: session.id,
        userId,
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
        stripePaymentIntentId: getPaymentIntentId(session.payment_intent),
        planId: pack.id,
        credits,
        amountTotal: session.amount_total ?? pack.amount,
        currency: session.currency ?? pack.currency,
        stripeStatus: session.status ?? "complete",
        paymentStatus: session.payment_status ?? "paid",
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Stripe webhook handling failed.",
      },
      { status: 500 },
    );
  }
}
