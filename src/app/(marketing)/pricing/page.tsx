import { CreditPackGrid } from "@/components/billing/credit-pack-grid";
import { FreeTierCard } from "@/components/billing/free-tier-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default async function PricingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-[1700px] px-6 pb-20 pt-10 md:px-10 md:pt-16">
        <div className="flex justify-center">
          <CreditPackGrid
            gridClassName="w-full max-w-[1380px] lg:grid-cols-4"
            leadingCard={<FreeTierCard />}
          />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
