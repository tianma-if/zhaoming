import { LegalPage } from "@/components/marketing/legal-page";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This policy explains what information Zhaoming collects, how it is used, and how we protect data related to accounts, billing, and astrology analysis activity on our platform."
      lastUpdated="May 27, 2026"
      sections={[
        {
          title: "Information we collect",
          body: (
            <>
              <p>
                We may collect account information such as your name, email
                address, sign-in identifiers, and basic billing metadata required
                to deliver paid features.
              </p>
              <p>
                We also collect information you submit while using the product,
                such as chart inputs, generated analysis records, usage events,
                and support-related communications.
              </p>
            </>
          ),
        },
        {
          title: "How we use information",
          body: (
            <>
              <p>
                We use collected information to operate the service, authenticate
                users, generate purchased reports, manage subscriptions or
                credits, prevent fraud, improve product quality, and comply with
                legal obligations.
              </p>
              <p>
                We may use service data in aggregated or operational form to
                improve reliability, performance, and user experience.
              </p>
            </>
          ),
        },
        {
          title: "Payments and third parties",
          body: (
            <>
              <p>
                Payments are processed by third-party providers. We do not store
                full payment card details on our own servers.
              </p>
              <p>
                We may share limited data with infrastructure, authentication,
                analytics, and payment providers only to the extent needed to run
                the service securely and lawfully.
              </p>
            </>
          ),
        },
        {
          title: "Data retention and security",
          body: (
            <>
              <p>
                We retain data for as long as reasonably necessary to provide the
                service, maintain business records, resolve disputes, enforce
                agreements, and meet legal requirements.
              </p>
              <p>
                We use reasonable technical and organizational safeguards to
                protect personal information, but no online system can be
                guaranteed to be completely secure.
              </p>
            </>
          ),
        },
        {
          title: "Your choices",
          body: (
            <>
              <p>
                You may request updates or deletion of account information where
                applicable, subject to legal, billing, fraud-prevention, and
                record-keeping requirements.
              </p>
              <p>
                Continued use of the service after policy updates constitutes
                acceptance of the revised policy.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
