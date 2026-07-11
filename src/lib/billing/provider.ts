import { getBillingProvider as getConfiguredBillingProvider } from "@/lib/env";

export type BillingProvider = "stripe";

export function getBillingProvider(): BillingProvider {
  return getConfiguredBillingProvider() as BillingProvider;
}
