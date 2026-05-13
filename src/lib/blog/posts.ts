import { cache } from "react";
import { getPublishedPostBySlug, listPublishedPosts } from "@/lib/data";
import type { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

export const getPublishedPosts = cache(async (): Promise<PostRow[]> => {
  return listPublishedPosts();
});

export const getPostBySlug = cache(async (slug: string): Promise<PostRow | null> => {
  return getPublishedPostBySlug(slug);
});
