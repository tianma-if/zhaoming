import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getOptionalServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await getOptionalServerSupabaseClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.36em] text-muted-foreground">AUTH</p>
          <CardTitle>登录知微</CardTitle>
          <CardDescription>
            当前阶段接入 Supabase Google OAuth，后续可直接承接付费与积分体系。
          </CardDescription>
        </div>
        <GoogleSignInButton />
      </Card>
    </main>
  );
}
