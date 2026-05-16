import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardBreadcrumbs } from "@/components/layout/dashboard-breadcrumbs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/82 px-4 backdrop-blur-md md:h-14">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="min-w-0">
          <DashboardBreadcrumbs />
        </div>
      </div>
      <Button asChild className="h-9 rounded-md px-3 text-sm">
        <Link href="/divinations/new">
          <Plus className="size-4" />
          <span className="hidden sm:inline">新建测算</span>
        </Link>
      </Button>
    </header>
  );
}
