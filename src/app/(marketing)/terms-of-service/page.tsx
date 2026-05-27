import { LegalPage } from "@/components/marketing/legal-page";

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      intro="These terms govern access to and use of Zhaoming, including our chart generation tools, AI-assisted interpretation features, subscription plans, and credit-based digital products."
      lastUpdated="May 27, 2026"
      sections={[
        {
          title: "Service scope",
          body: (
            <>
              <p>
                Zhaoming provides web-based digital products and SaaS features
                related to traditional Chinese astrology analysis, including chart
                generation, AI-assisted interpretation, and premium digital
                reports.
              </p>
              <p>
                The service is provided for personal informational use. It is not
                medical, legal, financial, or psychological advice.
              </p>
            </>
          ),
        },
        {
          title: "Accounts and access",
          body: (
            <>
              <p>
                Some features require an account. You are responsible for keeping
                your login credentials secure and for activity that occurs under
                your account.
              </p>
              <p>
                We may suspend access where required to prevent abuse, fraud,
                chargebacks, security incidents, or violations of applicable law.
              </p>
            </>
          ),
        },
        {
          title: "Billing and digital purchases",
          body: (
            <>
              <p>
                Paid features may be offered as subscriptions, one-time digital
                reports, or credit packs. Pricing and feature availability are
                shown on the pricing page at the time of purchase.
              </p>
              <p>
                Payments are processed by our authorized payment partners. By
                completing a purchase, you authorize the charge for the selected
                product and acknowledge that digital services may begin
                immediately after payment.
              </p>
            </>
          ),
        },
        {
          title: "Acceptable use",
          body: (
            <>
              <p>
                You agree not to misuse the service, attempt unauthorized access,
                interfere with platform stability, reverse engineer protected
                parts of the product, or use the service in violation of law or
                third-party rights.
              </p>
              <p>
                We may limit or terminate abusive or fraudulent usage to protect
                the platform and other users.
              </p>
            </>
          ),
        },
        {
          title: "Content and availability",
          body: (
            <>
              <p>
                We work to keep the service available and the results useful, but
                we do not guarantee uninterrupted operation, specific outcomes,
                or suitability for every purpose.
              </p>
              <p>
                Product features, pricing, and experience may change over time as
                the platform evolves.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
