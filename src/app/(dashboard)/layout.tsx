import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset className="bg-linear-to-br from-background via-background to-muted/35">
        <DashboardHeader />
        <div className="flex-1 px-4 py-5 md:px-6 md:py-6">
          <div className="pb-20">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
