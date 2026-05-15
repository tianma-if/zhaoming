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
      <div className="mx-auto grid min-h-screen w-full max-w-none gap-0 lg:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen border-r border-border bg-[#fcfcfb] p-6">
            <WorkspaceSidebar email={user.email} name={user.name} image={user.image} />
          </div>
        </div>

        <section className="min-w-0 px-4 py-4 md:px-8 md:py-8">
          <div className="lg:hidden">
            <div className="mb-6 rounded-[1.2rem] border border-border bg-[#fcfcfb] p-4">
              <WorkspaceSidebar email={user.email} name={user.name} image={user.image} />
            </div>
          </div>
          <div className="pb-20">{children}</div>
        </section>
      </div>
    </main>
  );
}
