"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  dashboardNavGroups,
  getActiveDashboardHref,
  type DashboardNavItem,
} from "@/config/dashboard-nav";
import { SubscriptionPlansDialog } from "@/components/billing/subscription-plans-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const hasNote = Boolean(item.note);
  const baseItemClassName = cn(
    "rounded-md p-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground [&>svg]:size-4",
    hasNote ? "h-auto min-h-8 items-start [&>svg]:mt-0.5" : "h-8",
  );

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
            <span className="min-w-0">
              <span className="block truncate">{item.title}</span>
              {item.note ? (
                <span
                  className={cn(
                    "block truncate text-[11px] font-normal",
                    isActive ? "text-sidebar-accent-foreground/70" : "text-sidebar-foreground/55",
                  )}
                >
                  {item.note}
                </span>
              ) : null}
            </span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip={item.title}
          aria-disabled="true"
          className="h-auto min-h-8 cursor-default items-start rounded-md p-2 opacity-70 hover:bg-transparent hover:text-sidebar-foreground [&>svg]:mt-0.5 [&>svg]:size-4"
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

export function AppSidebar() {
  const pathname = usePathname();
  const activeHref = getActiveDashboardHref(pathname);

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-r border-sidebar-border/80"
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
    >
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border/90 px-3 md:h-14">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-md">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-base font-semibold text-background">
            照
          </span>
          <span className="grid min-w-0 gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-lg font-semibold leading-none">照命</span>
            <span className="truncate text-xs text-sidebar-foreground/60">AI 命理工作台</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden px-2 py-3">
        {dashboardNavGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-0">
            <SidebarGroupLabel className="px-2 text-xs font-medium text-sidebar-foreground/70">
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
      <SidebarFooter className={cn("border-t border-sidebar-border/90 p-2")}>
        <SubscriptionPlansDialog />
        <DashboardUserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
