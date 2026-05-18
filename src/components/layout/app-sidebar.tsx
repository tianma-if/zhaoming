"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  dashboardNavGroups,
  getActiveDashboardHref,
  type DashboardNavItem,
} from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";
import { DashboardUserMenu } from "./dashboard-user-menu";

function NavItem({
  item,
  activeHref,
}: {
  item: DashboardNavItem;
  activeHref: string | null;
}) {
  const Icon = item.icon;
  const isActive = item.href ? activeHref === item.href : false;
  const baseItemClassName =
    "h-auto min-h-11 rounded-xl px-3 py-2 text-[15px] text-sidebar-foreground hover:bg-black/4 hover:text-sidebar-foreground data-[active=true]:bg-black/6 data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground [&>svg]:size-[1.15rem]";

  if (item.items?.length) {
    return (
      <Collapsible
        asChild
        defaultOpen={item.items.some((child) => child.href === activeHref)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className={baseItemClassName}
            >
              <Icon />
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((child) => (
                <SidebarMenuSubItem key={child.title}>
                  <SidebarMenuSubButton asChild isActive={activeHref === child.href}>
                    <Link href={child.href ?? "#"}>
                      <span>{child.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      {item.href ? (
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={isActive}
          className={baseItemClassName}
        >
          <Link href={item.href}>
            <Icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip={item.title}
          aria-disabled="true"
          className="h-auto min-h-11 cursor-default items-start rounded-xl px-3 py-2 opacity-75 hover:bg-transparent hover:text-sidebar-foreground [&>svg]:mt-0.5 [&>svg]:size-[1.15rem]"
        >
          <Icon />
          <span className="min-w-0">
            <span className="block truncate">{item.title}</span>
            {item.note ? (
              <span className="block truncate text-xs font-normal text-sidebar-foreground/55">
                {item.note}
              </span>
            ) : null}
          </span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar({
  email,
  name,
  image,
}: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  const pathname = usePathname();
  const activeHref = getActiveDashboardHref(pathname);

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-r border-sidebar-border/80"
      style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
    >
      <SidebarHeader className="border-b border-sidebar-border/90 px-6 py-6">
        <Link href="/" className="flex min-w-0 items-center gap-4 rounded-md">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-lg font-semibold text-background">
            知
          </span>
          <span className="grid min-w-0 gap-1 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[2rem] font-semibold leading-none tracking-[-0.02em]">
              知微
            </span>
            <span className="truncate text-sm text-sidebar-foreground/60">AI 命理工作台</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-5 py-6">
        {dashboardNavGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-0 py-0">
            <SidebarGroupLabel className="mb-3 px-1 text-base font-medium text-sidebar-foreground/58">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItem key={`${group.label}-${item.title}`} item={item} activeHref={activeHref} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className={cn("border-t border-sidebar-border/90 px-5 py-5")}>
        <Button className="h-14 rounded-2xl bg-foreground text-base font-semibold text-background hover:opacity-92">
          <Crown className="size-5" />
          解锁全部功能
        </Button>
        <DashboardUserMenu email={email} name={name} image={image} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
