import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <SidebarProvider>
      <AppSidebar email={user.email} name={user.name} image={user.image} />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 px-4 py-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl pb-20">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
