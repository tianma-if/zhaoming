"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
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

  if (item.items?.length) {
    return (
      <Collapsible
        asChild
        defaultOpen={item.items.some((child) => child.href === activeHref)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isActive}>
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
        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
          <Link href={item.href}>
            <Icon />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          tooltip={item.title}
          aria-disabled="true"
          className="h-auto min-h-8 cursor-default items-start opacity-70 hover:bg-transparent hover:text-sidebar-foreground"
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
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-md px-1 py-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground text-base font-semibold text-background">
            知
          </span>
          <span className="grid min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-base font-semibold">知微</span>
            <span className="truncate text-xs text-sidebar-foreground/60">AI 命理工作台</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        {dashboardNavGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItem key={`${group.label}-${item.title}`} item={item} activeHref={activeHref} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className={cn("border-t border-sidebar-border p-2")}>
        <DashboardUserMenu email={email} name={name} image={image} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
