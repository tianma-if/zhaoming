import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { getOptionalServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const supabase = await getOptionalServerSupabaseClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
      <Link href="/" className="font-display text-3xl tracking-[0.22em]">
        知微
      </Link>

      <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
        {siteConfig.nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {user ? (
          <Link href="/dashboard">
            <Button variant="outline">进入工作台</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="outline">登录</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
