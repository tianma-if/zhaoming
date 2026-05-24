"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bot,
  CalendarDays,
  Calculator,
  HeartHandshake,
  Hand,
  type LucideIcon,
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

type SidebarItem = {
  href: string | null;
  label: string;
  note?: string;
  icon: LucideIcon;
};

type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

const groups: SidebarGroup[] = [
  {
    label: "命理类",
    items: [
      { href: "/divinations/new", label: "八字算命", note: "四柱推命", icon: Calculator },
      { href: "/divinations/ziwei", label: "紫微斗数", note: "命宫排盘", icon: Sparkles },
      { href: "/divinations/chenggu", label: "袁天罡称骨", note: "骨重歌诀", icon: CalendarDays },
    ],
  },
  {
    label: "占卜类",
    items: [
      { href: "/divinations/liuyao", label: "六爻占卜", note: "起卦解读", icon: Ticket },
      { href: "/divinations/meihua", label: "梅花易数", note: "象数起卦", icon: Orbit },
      { href: "/divinations/sanshi", label: "三式", note: "奇门遁甲、太乙神数、大六壬", icon: HeartHandshake },
    ],
  },
  {
    label: "相术类",
    items: [
      { href: null, label: "面相学", icon: UserRound },
      { href: null, label: "手相学", icon: Hand },
    ],
  },
  {
    label: "其他功能",
    items: [
      { href: "/dashboard", label: "总览", icon: Sparkles },
      { href: "/divinations", label: "测算记录", icon: CalendarDays },
      { href: null, label: "AI 老黄历", icon: Bot },
    ],
  },
];

const navigableHrefs = groups
  .flatMap((group) => group.items)
  .map((item) => item.href)
  .filter((href): href is string => Boolean(href))
  .sort((a, b) => b.length - a.length);

function getActiveHref(pathname: string) {
  return (
    navigableHrefs.find((href) => pathname === href || pathname.startsWith(`${href}/`)) ?? null
  );
}

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
  const [pendingNavigation, setPendingNavigation] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const displayPath =
    pendingNavigation && pendingNavigation.from === pathname
      ? pendingNavigation.to
      : pathname;

  const activeHref = getActiveHref(displayPath);

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
                  const isActive = item.href ? activeHref === item.href : false;
                  const Icon = item.icon;
                  const href = item.href;

                  const content = (
                    <>
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0">
                        <span className="block">{item.label}</span>
                        {"note" in item && item.note ? (
                          <span
                            className={cn(
                              "mt-0.5 block text-xs tracking-[0.04em]",
                              isActive ? "text-white/72" : "text-muted-foreground",
                            )}
                          >
                            {item.note}
                          </span>
                        ) : null}
                      </span>
                    </>
                  );

                  return href ? (
                    <Link
                      key={`${group.label}-${item.label}`}
                      href={href}
                      onClick={(event) => {
                        if (
                          event.defaultPrevented ||
                          event.button !== 0 ||
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey
                        ) {
                          return;
                        }

                        if (href !== pathname) {
                          setPendingNavigation({
                            from: pathname,
                            to: href,
                          });
                        }
                      }}
                      className={cn(
                        "flex items-start gap-3 rounded-lg px-3 py-2.5 text-base transition",
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
                      className="flex cursor-default items-start gap-3 rounded-lg px-3 py-2.5 text-base text-foreground/88"
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

      <div className="mt-auto space-y-6 px-2 pb-2 pt-10">
        <Separator />
        <div className="space-y-2 rounded-2xl border border-border/60 bg-white/75 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{name ?? "未命名用户"}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
            {image ? (
              <p className="text-[11px] text-muted-foreground/80">
                当前头像已由 Better Auth 同步
              </p>
            ) : null}
          </div>
          <SignOutButton>
            <Button variant="outline" className="mt-3 w-full justify-start rounded-xl">
              <LogOut className="size-4" />
              退出登录
            </Button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  );
}
