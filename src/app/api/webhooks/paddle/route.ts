import { NextResponse } from "next/server";
import { getCreditPack } from "@/lib/billing/plans";
import { verifyPaddleWebhookSignature } from "@/lib/billing/paddle";
import { fulfillBillingCheckoutSession } from "@/lib/data";
import { getEnv, hasPaddleWebhookEnv, isBillingEnabled } from "@/lib/env";

interface PaddleTransactionCompletedEvent {
  event_id?: string;
  event_type?: string;
  data?: {
    id?: string;
    status?: string;
    customer_id?: string | null;
    currency_code?: string | null;
    custom_data?: {
      planId?: string;
      userId?: string;
      credits?: number | string;
    } | null;
    details?: {
      totals?: {
        grand_total?: number | null;
      } | null;
    } | null;
  } | null;
}

export async function POST(request: Request) {
  try {
    if (!isBillingEnabled()) {
      return NextResponse.json({ error: "支付功能当前未启用。" }, { status: 503 });
    }

    if (!hasPaddleWebhookEnv()) {
      return NextResponse.json({ error: "Paddle webhook is not configured." }, { status: 503 });
    }

    const env = getEnv();
    const signature = request.headers.get("paddle-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Paddle-Signature header." }, { status: 400 });
    }

    const rawBody = await request.text();
    const isValid = verifyPaddleWebhookSignature({
      rawBody,
      signature,
      secret: env.PADDLE_WEBHOOK_SECRET!,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid Paddle signature." }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as PaddleTransactionCompletedEvent;

    if (event.event_type === "transaction.completed") {
      const transaction = event.data;
      const planId = transaction?.custom_data?.planId ?? "";
      const userId = transaction?.custom_data?.userId ?? "";
      const credits = Number(transaction?.custom_data?.credits ?? 0);
      const pack = getCreditPack(planId);

      if (!transaction?.id || !pack || !userId || !Number.isFinite(credits) || credits <= 0) {
        return NextResponse.json(
          { error: "Missing transaction metadata required for fulfillment." },
          { status: 400 },
        );
      }

      await fulfillBillingCheckoutSession({
        provider: "paddle",
        sessionId: transaction.id,
        userId,
        providerCustomerId: transaction.customer_id ?? null,
        providerPaymentReferenceId: null,
        planId: pack.id,
        credits,
        amountTotal: transaction.details?.totals?.grand_total ?? pack.amount,
        currency: transaction.currency_code?.toLowerCase() ?? pack.currency,
        providerStatus: transaction.status ?? "completed",
        paymentStatus: "paid",
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paddle webhook handling failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Paddle webhook handling failed.",
      },
      { status: 500 },
    );
  }
}
