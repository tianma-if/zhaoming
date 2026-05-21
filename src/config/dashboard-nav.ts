import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CalendarDays,
  Calculator,
  Hand,
  HeartHandshake,
  LayoutDashboard,
  Orbit,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react";

export type DashboardNavItem = {
  title: string;
  href?: string;
  note?: string;
  icon: LucideIcon;
  items?: DashboardNavItem[];
};

export type DashboardNavGroup = {
  label: string;
  items: DashboardNavItem[];
};

export const dashboardNavGroups: DashboardNavGroup[] = [
  {
    label: "工作台",
    items: [
      { href: "/dashboard", title: "总览", icon: LayoutDashboard },
      { href: "/divinations", title: "测算记录", icon: CalendarDays },
      { href: "/profile", title: "个人资料", icon: UserRound },
    ],
  },
  {
    label: "命理类",
    items: [
      { href: "/divinations/new", title: "八字算命", note: "四柱推命", icon: Calculator },
      { href: "/divinations/ziwei", title: "紫微斗数", note: "命宫排盘", icon: Sparkles },
      { href: "/divinations/chenggu", title: "袁天罡称骨", note: "骨重歌诀", icon: CalendarDays },
    ],
  },
  {
    label: "占卜类",
    items: [
      { title: "六爻占卜", note: "纳甲筮法", icon: Ticket },
      { title: "梅花易数", icon: Orbit },
      { title: "三式", note: "奇门遁甲、太乙神数、大六壬", icon: HeartHandshake },
    ],
  },
  {
    label: "相术与工具",
    items: [
      { title: "面相学", icon: UserRound },
      { title: "手相学", icon: Hand },
      { title: "AI 老黄历", icon: Bot },
    ],
  },
];

export function getActiveDashboardHref(pathname: string) {
  const hrefs = dashboardNavGroups
    .flatMap((group) => group.items)
    .flatMap((item) => [item.href, ...(item.items?.map((child) => child.href) ?? [])])
    .filter((href): href is string => Boolean(href))
    .sort((a, b) => b.length - a.length);

  return hrefs.find((href) => pathname === href || pathname.startsWith(`${href}/`)) ?? null;
}

export function getDashboardBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "首页", href: "/" }];
  }

  const labels: Record<string, string> = {
    dashboard: "总览",
    divinations: "测算记录",
    new: "新建测算",
    ziwei: "紫微排盘",
    chenggu: "袁天罡称骨",
    profile: "个人资料",
  };

  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const previousSegment = segments[index - 1];
    const isDivinationDetail = previousSegment === "divinations" && !labels[segment];

    return {
      label: labels[segment] ?? (isDivinationDetail ? "解盘详情" : "详情"),
      href: index === segments.length - 1 ? undefined : href,
    };
  });
}
