import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { getAuthSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await getAuthSession();
  const user = session?.user ?? null;

  return (
    <header className="border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="font-display text-3xl tracking-[0.18em]">
          知微
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <Button>进入工作台</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline">登录</Button>
            </Link>
          )}
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-6xl gap-5 overflow-x-auto px-6 pb-4 text-sm text-muted-foreground md:hidden md:px-10">
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 transition hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
