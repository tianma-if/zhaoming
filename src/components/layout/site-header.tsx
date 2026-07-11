import Link from "next/link";
import { getAuthSession } from "@/lib/auth/session";
import { siteConfig } from "@/lib/constants";
import { GitHubLink } from "@/components/layout/github-link";
import { SiteHeaderAuthButton } from "@/components/layout/site-header-auth-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function SiteHeader() {
  const session = await getAuthSession();
  const user = session?.user ?? null;
  const locale = await getLocale();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
      <Link href="/" className="font-display text-3xl tracking-[0.18em]">
        照命
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        {siteConfig.nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-foreground">
            {item.href === "/" ? translate(locale, "nav.home") : item.href === "/blog" ? translate(locale, "nav.blog") : translate(locale, "nav.pricing")}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <GitHubLink />
        <LanguageSwitcher />
        <SiteHeaderAuthButton isAuthenticated={Boolean(user)} />
      </div>
    </header>
  );
}
