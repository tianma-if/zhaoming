import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { createBillingCheckoutIntent, normalizeReturnPath } from "@/lib/billing/checkout";
import { isBillingEnabled } from "@/lib/env";

const requestSchema = z.object({
  planId: z.string().min(1),
  returnPath: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    if (!isBillingEnabled()) {
      return NextResponse.json({ error: "支付功能当前未启用。" }, { status: 503 });
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

    const checkout = await createBillingCheckoutIntent({
      user,
      planId,
    });

    return NextResponse.json(checkout);
  } catch (error) {
    console.error("Billing checkout creation failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "创建支付订单失败。",
      },
      { status: 500 },
    );
  }
}
