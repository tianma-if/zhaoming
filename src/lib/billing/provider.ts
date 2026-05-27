import { getBillingProvider as getConfiguredBillingProvider } from "@/lib/env";

export type BillingProvider = "stripe" | "paddle";

export function getBillingProvider(): BillingProvider {
  return getConfiguredBillingProvider();
}
