import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidateBlogRoutes } from "@/lib/blog/revalidate";
import { getEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

const publishSchema = z.object({
  slug: z.string().trim().optional(),
  title: z.string().trim().min(3),
  content: z.string().trim().min(20),
  metaDescription: z.string().trim().max(180).optional(),
  tags: z.array(z.string()).optional().default([]),
  publishedAt: z.string().optional(),
});

function isAuthorized(request: Request) {
  const env = getEnv();
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headerKey = request.headers.get("x-automation-key");
  return env.AUTOMATION_API_KEY && [bearer, headerKey].includes(env.AUTOMATION_API_KEY);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = publishSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.title);

  const { data, error } = await supabase
    .from("posts")
    .upsert({
      slug,
      title: parsed.data.title,
      content: parsed.data.content,
      meta_description: parsed.data.metaDescription ?? null,
      tags: parsed.data.tags,
      source: "automation",
      published_at: parsed.data.publishedAt ?? new Date().toISOString(),
    } as never)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateBlogRoutes(slug);

  return NextResponse.json({ post: data });
}
