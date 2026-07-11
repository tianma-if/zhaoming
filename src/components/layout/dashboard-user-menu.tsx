"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Sparkles, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/components/i18n-provider";

export function DashboardUserMenu() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [isPending, setIsPending] = useState(false);
  const { t } = useI18n();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email ?? (isSessionPending ? "loading@zhaoming.local" : "guest@zhaoming.local");
  const displayName = user?.name || (user ? email : t("dashboard.userMode"));
  const initials = displayName.slice(0, 1).toUpperCase();

  async function handleSignOut() {
    setIsPending(true);

    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              disabled={isSessionPending}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user?.image ?? undefined} alt={displayName} />
                <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {isSessionPending ? t("dashboard.loading") : email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user?.image ?? undefined} alt={displayName} />
                  <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled={isSessionPending} onSelect={() => router.push("/divinations/new")}>
                <Sparkles className="size-4" />
                {t("nav.newDivination")}
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isSessionPending} onSelect={() => router.push("/profile")}>
                <UserRound className="size-4" />
                {t("dashboard.profile")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {process.env.NEXT_PUBLIC_AUTH_MODE !== "none" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={isPending || isSessionPending || !user} onSelect={handleSignOut}>
                  <LogOut className="size-4" />
                  {isPending ? t("dashboard.signingOut") : t("dashboard.signOut")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
