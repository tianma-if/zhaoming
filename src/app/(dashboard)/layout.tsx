import Link from "next/link";
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
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div>
          <p className="text-xs tracking-[0.36em] text-muted-foreground">WORKSPACE</p>
          <h1 className="font-display text-3xl tracking-[0.12em]">知微工作台</h1>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/dashboard">概览</Link>
          <Link href="/divinations">记录</Link>
          <Link href="/divinations/new">新测算</Link>
          <Link href="/profile">{user.email}</Link>
        </div>
      </header>
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">{children}</section>
    </main>
  );
}
