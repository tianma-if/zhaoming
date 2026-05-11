import { redirect } from "next/navigation";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
