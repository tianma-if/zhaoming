import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getEnv, hasSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function getOptionalServerSupabaseClient() {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  return getServerSupabaseClient();
}

export async function getServerSupabaseClient(): Promise<SupabaseClient<Database>> {
  const env = getEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components can read cookies during render but may not mutate them.
          }
        },
      },
    },
  );
}
