import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LegalSection = {
  title: string;
  body: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-12 md:px-10 md:pt-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-[-0.03em] text-foreground md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#666666]">{intro}</p>
          <p className="mt-4 text-sm tracking-[0.12em] text-muted-foreground">
            Last updated {lastUpdated}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-5">
          {sections.map((section) => (
            <Card
              key={section.title}
              className="rounded-[1.75rem] border-[#ece7e2] bg-white shadow-none"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl tracking-[-0.02em] text-[#111111]">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-8 text-[#4f4f4f]">
                {section.body}
              </CardContent>
            </Card>
          ))}

          <Card className="rounded-[1.75rem] border-[#ece7e2] bg-[#faf8f5] shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl tracking-[-0.02em] text-[#111111]">
                Related pages
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 text-sm font-medium">
              <Link
                href="/pricing"
                className="rounded-full border border-[#ded8d1] px-4 py-2 text-[#111111] transition hover:border-[#111111]"
              >
                Pricing
              </Link>
              <Link
                href="/terms-of-service"
                className="rounded-full border border-[#ded8d1] px-4 py-2 text-[#111111] transition hover:border-[#111111]"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="rounded-full border border-[#ded8d1] px-4 py-2 text-[#111111] transition hover:border-[#111111]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund-policy"
                className="rounded-full border border-[#ded8d1] px-4 py-2 text-[#111111] transition hover:border-[#111111]"
              >
                Refund Policy
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
