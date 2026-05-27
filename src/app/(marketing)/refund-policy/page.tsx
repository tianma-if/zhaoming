import { LegalPage } from "@/components/marketing/legal-page";

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Refunds"
      title="Refund Policy"
      intro="This policy explains when refunds may be granted for Zhaoming subscriptions, digital reports, and credit-based purchases processed through our checkout providers."
      lastUpdated="May 27, 2026"
      sections={[
        {
          title: "General policy",
          body: (
            <>
              <p>
                Because Zhaoming provides digital services and AI-generated
                outputs that may be delivered immediately after purchase, refunds
                are generally reviewed case by case.
              </p>
              <p>
                We may approve refunds for duplicate charges, clear billing
                mistakes, technical failures that prevented delivery, or other
                circumstances where the purchased service was not provided as
                described.
              </p>
            </>
          ),
        },
        {
          title: "Non-refundable situations",
          body: (
            <>
              <p>
                Refunds are typically not provided for completed digital reports,
                used credits, partially used credit packs, or subscription time
                that has already been consumed, except where required by law.
              </p>
              <p>
                We also may deny refund requests involving account abuse, policy
                violations, or repeated chargeback-related misuse.
              </p>
            </>
          ),
        },
        {
          title: "Subscriptions",
          body: (
            <>
              <p>
                If subscriptions are offered, cancellation stops future renewal
                charges but does not automatically trigger a refund for the
                current billing period unless required by law or approved under
                this policy.
              </p>
              <p>
                Users should cancel before the next renewal date to avoid future
                charges.
              </p>
            </>
          ),
        },
        {
          title: "How to request a refund",
          body: (
            <>
              <p>
                Refund requests should be submitted promptly after the charge and
                must include enough information for us to identify the account and
                transaction.
              </p>
              <p>
                Approved refunds are returned through the original payment method
                according to the payment provider&apos;s processing timelines.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
