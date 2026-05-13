"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "八字命盘",
    items: [
      { href: "/divinations/new", label: "八字计算" },
      { href: "/divinations", label: "测算记录" },
    ],
  },
  {
    label: "工作台",
    items: [
      { href: "/dashboard", label: "总览" },
      { href: "/profile", label: "账户资料" },
    ],
  },
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
    <aside className="flex h-full flex-col">
      <div className="space-y-5">
        <div className="space-y-2 px-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="font-display text-2xl tracking-[0.08em]">知微</span>
          </Link>
          <p className="text-xs tracking-[0.28em] text-muted-foreground">WORKSPACE</p>
        </div>

        <div className="space-y-5">
          {groups.map((group, index) => (
            <div key={group.label} className="space-y-3">
              {index > 0 ? <Separator /> : null}
              <p className="px-1 text-xs tracking-[0.28em] text-muted-foreground">
                {group.label}
              </p>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition",
                        isActive
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Card className="space-y-4 rounded-[1.2rem] border border-border bg-white p-4 shadow-none">
          <div className="space-y-1">
            <p className="text-sm">{name || "当前账户"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <div className="space-y-2">
            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full">
                个人资料
              </Button>
            </Link>
            <SignOutButton variant="outline" className="w-full">
              退出登录
            </SignOutButton>
          </div>
        </Card>
      </div>
    </aside>
  );
}
