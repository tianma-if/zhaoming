import Link from "next/link";

const footerLinks = [
  { href: "/terms-of-service", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/refund-policy", label: "Refunds" },
];

export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-10 text-xs tracking-[0.18em] text-muted-foreground md:px-10">
      <div>TRADITIONAL COSMOLOGY, MODERN INTERFACE.</div>
      <nav className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.2em]">
        {footerLinks.map((link) => (
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
