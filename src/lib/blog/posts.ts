import { cache } from "react";
import { getOptionalServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

export const getPublishedPosts = cache(async (): Promise<PostRow[]> => {
  const supabase = await getOptionalServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("posts")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  return (data ?? []) as PostRow[];
});

export const getPostBySlug = cache(async (slug: string): Promise<PostRow | null> => {
  const supabase = await getOptionalServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return (data ?? null) as PostRow | null;
});
