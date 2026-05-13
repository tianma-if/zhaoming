"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

const workspaceNav = [
  { href: "/divinations/new", label: "新测算", eyebrow: "NEW" },
  { href: "/divinations", label: "测算记录", eyebrow: "ARCHIVE" },
  { href: "/dashboard", label: "总览", eyebrow: "OVERVIEW" },
  { href: "/profile", label: "账户", eyebrow: "ACCOUNT" },
];

export function WorkspaceSidebar({
  email,
  name,
}: {
  email: string;
  name?: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col justify-between">
      <div className="space-y-8">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="font-display text-3xl tracking-[0.18em]">知微</span>
          </Link>
          <p className="max-w-[15rem] text-sm leading-7 text-muted-foreground">
            以更安静的方式，进入一张命盘与它所携带的判断线索。
          </p>
        </div>

        <nav className="space-y-2">
          {workspaceNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-[1.6rem] px-4 py-3 transition",
                  isActive ? "bg-white/78 shadow-[0_18px_40px_-30px_rgba(22,20,17,0.32)]" : "hover:bg-white/48",
                )}
              >
                <p className="text-[11px] tracking-[0.28em] text-muted-foreground">
                  {item.eyebrow}
                </p>
                <p className="mt-1 text-sm">{item.label}</p>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 rounded-[1.8rem] border border-border/80 bg-white/42 p-4">
        <div className="space-y-1">
          <p className="text-sm">{name || "当前账户"}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/profile"
            className="rounded-full border border-border/90 px-4 py-2 text-center text-sm transition hover:bg-white/70"
          >
            查看账户
          </Link>
          <SignOutButton variant="ghost" className="justify-center rounded-full border border-border/90 px-4 py-2 text-sm">
            退出登录
          </SignOutButton>
        </div>
      </div>
    </aside>
  );
}
