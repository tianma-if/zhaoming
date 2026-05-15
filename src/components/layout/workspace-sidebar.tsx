"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CalendarDays,
  Calculator,
  HeartHandshake,
  LogOut,
  Orbit,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "八字命盘",
    items: [
      { href: "/divinations/new", label: "八字计算", icon: Calculator },
      { href: null, label: "八字合婚", icon: HeartHandshake },
      { href: null, label: "每日运势", icon: CalendarDays },
    ],
  },
  {
    label: "紫微斗数",
    items: [
      { href: null, label: "紫微排盘", icon: Sparkles },
      { href: null, label: "紫微合婚", icon: HeartHandshake },
    ],
  },
  {
    label: "周易占卜",
    items: [
      { href: null, label: "梅花易数·每日决策", icon: Orbit },
      { href: null, label: "六爻", icon: Ticket },
    ],
  },
  {
    label: "其他功能",
    items: [
      { href: "/dashboard", label: "总览", icon: Sparkles },
      { href: "/divinations", label: "测算记录", icon: CalendarDays },
      { href: "/profile", label: "个人资料", icon: UserRound },
      { href: null, label: "AI 老黄历", icon: Bot },
    ],
  },
];

export function WorkspaceSidebar({
  email,
  name,
  image,
}: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col">
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-2 pt-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-lg text-white">
            知
          </span>
          <div className="space-y-1">
            <Link href="/" className="block text-3xl font-semibold tracking-[-0.02em]">
              知微
            </Link>
            <p className="text-xs tracking-[0.22em] text-muted-foreground">Workspace</p>
          </div>
        </div>

        <div className="space-y-7 px-2">
          {groups.map((group) => (
            <div key={group.label} className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">{group.label}</p>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = item.href
                    ? pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))
                    : false;
                  const Icon = item.icon;

                  const content = (
                    <>
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </>
                  );

                  return item.href ? (
                    <Link
                      key={`${group.label}-${item.label}`}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition",
                        isActive
                          ? "bg-black text-white"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {content}
                    </Link>
                  ) : (
                    <span
                      key={`${group.label}-${item.label}`}
                      className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 text-base text-foreground/88"
                    >
                      {content}
                    </span>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="space-y-4">
          <Button className="h-14 w-full rounded-xl text-base">解锁全部功能</Button>

          <Separator />

          <div className="space-y-4 rounded-t-2xl px-2 pt-3">
            <div className="flex items-center gap-3">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name || email}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm">
                  {(name || email).slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{name || "当前账户"}</p>
                <p className="truncate text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/profile" className="block">
                <Button
                  variant="outline"
                  className="h-12 w-full justify-center rounded-xl text-base"
                >
                  <UserRound className="mr-2 h-4 w-4" />
                  个人资料
                </Button>
              </Link>
              <SignOutButton
                variant="outline"
                className="h-12 w-full justify-center rounded-xl text-base"
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
