import { WorkspaceSidebar } from "@/components/layout/workspace-sidebar";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-[1680px] gap-8 px-4 py-4 md:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-8">
        <div className="hidden lg:block">
          <div className="sticky top-4 h-[calc(100vh-2rem)] rounded-[1.8rem] border border-border/70 bg-[#fafafa] p-4">
            <WorkspaceSidebar email={user.email} name={user.name} />
          </div>
        </div>

        <section className="min-w-0">
          <div className="lg:hidden">
            <div className="mb-6 rounded-[1.8rem] border border-border/70 bg-[#fafafa] p-4">
              <WorkspaceSidebar email={user.email} name={user.name} />
            </div>
          </div>
          <div className="pb-20">{children}</div>
        </section>
      </div>
    </main>
  );
}
