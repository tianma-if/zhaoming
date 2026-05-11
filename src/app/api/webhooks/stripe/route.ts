import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message:
      "Stripe webhook scaffold is ready. Handle signature verification and subscription state sync here later.",
  });
}
