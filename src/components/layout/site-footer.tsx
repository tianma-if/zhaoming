import Link from "next/link";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function SiteFooter() {
  const locale = await getLocale();
  const links = [
    { href: "/terms-of-service", label: translate(locale, "footer.terms") },
    { href: "/privacy-policy", label: translate(locale, "footer.privacy") },
    { href: "/refund-policy", label: translate(locale, "footer.refunds") },
  ];
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-10 text-xs tracking-[0.18em] text-muted-foreground md:px-10">
      <div>{translate(locale, "footer.tagline")}</div>
      <nav className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.2em]">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
